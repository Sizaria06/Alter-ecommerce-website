try {
    self["workbox:core:5.1.3"] && _()
} catch (s) {}
const s = (s, ...e) => {
    let c = s;
    return e.length > 0 && (c += " :: " + JSON.stringify(e)), c
};
class e extends Error {
    constructor(e, c) {
        super(s(e, c)), this.name = e, this.details = c
    }
}
try {
    self["workbox:routing:5.1.3"] && _()
} catch (s) {}
const c = s => s && "object" == typeof s ? s : {
    handle: s
};
class a {
    constructor(s, e, a = "GET") {
        this.handler = c(e), this.match = s, this.method = a
    }
}
class t extends a {
    constructor(s, e, c) {
        super(({
            url: e
        }) => {
            const c = s.exec(e.href);
            if (c && (e.origin === location.origin || 0 === c.index)) return c.slice(1)
        }, e, c)
    }
}
const n = s => new URL(String(s), location.href).href.replace(new RegExp("^" + location.origin), "");
class i {
    constructor() {
        this.s = new Map
    }
    get routes() {
        return this.s
    }
    addFetchListener() {
        self.addEventListener("fetch", s => {
            const {
                request: e
            } = s, c = this.handleRequest({
                request: e,
                event: s
            });
            c && s.respondWith(c)
        })
    }
    addCacheListener() {
        self.addEventListener("message", s => {
            if (s.data && "CACHE_URLS" === s.data.type) {
                const {
                    payload: e
                } = s.data, c = Promise.all(e.urlsToCache.map(s => {
                    "string" == typeof s && (s = [s]);
                    const e = new Request(...s);
                    return this.handleRequest({
                        request: e
                    })
                }));
                s.waitUntil(c), s.ports && s.ports[0] && c.then(() => s.ports[0].postMessage(!0))
            }
        })
    }
    handleRequest({
        request: s,
        event: e
    }) {
        const c = new URL(s.url, location.href);
        if (!c.protocol.startsWith("http")) return;
        const {
            params: a,
            route: t
        } = this.findMatchingRoute({
            url: c,
            request: s,
            event: e
        });
        let n, i = t && t.handler;
        if (!i && this.t && (i = this.t), i) {
            try {
                n = i.handle({
                    url: c,
                    request: s,
                    event: e,
                    params: a
                })
            } catch (s) {
                n = Promise.reject(s)
            }
            return n instanceof Promise && this.i && (n = n.catch(a => this.i.handle({
                url: c,
                request: s,
                event: e
            }))), n
        }
    }
    findMatchingRoute({
        url: s,
        request: e,
        event: c
    }) {
        const a = this.s.get(e.method) || [];
        for (const t of a) {
            let a;
            const n = t.match({
                url: s,
                request: e,
                event: c
            });
            if (n) return a = n, (Array.isArray(n) && 0 === n.length || n.constructor === Object && 0 === Object.keys(n).length || "boolean" == typeof n) && (a = void 0), {
                route: t,
                params: a
            }
        }
        return {}
    }
    setDefaultHandler(s) {
        this.t = c(s)
    }
    setCatchHandler(s) {
        this.i = c(s)
    }
    registerRoute(s) {
        this.s.has(s.method) || this.s.set(s.method, []), this.s.get(s.method).push(s)
    }
    unregisterRoute(s) {
        if (!this.s.has(s.method)) throw new e("unregister-route-but-not-found-with-method", {
            method: s.method
        });
        const c = this.s.get(s.method).indexOf(s);
        if (!(c > -1)) throw new e("unregister-route-route-not-registered");
        this.s.get(s.method).splice(c, 1)
    }
}
let r;
const o = () => (r || (r = new i, r.addFetchListener(), r.addCacheListener()), r);

function g(s, c, n) {
    let i;
    if ("string" == typeof s) {
        const e = new URL(s, location.href);
        i = new a(({
            url: s
        }) => s.href === e.href, c, n)
    } else if (s instanceof RegExp) i = new t(s, c, n);
    else if ("function" == typeof s) i = new a(s, c, n);
    else {
        if (!(s instanceof a)) throw new e("unsupported-route-type", {
            moduleName: "workbox-routing",
            funcName: "registerRoute",
            paramName: "capture"
        });
        i = s
    }
    return o().registerRoute(i), i
}
const d = {
        googleAnalytics: "googleAnalytics",
        precache: "precache-v2",
        prefix: "workbox",
        runtime: "runtime",
        suffix: "undefined" != typeof registration ? registration.scope : ""
    },
    h = s => [d.prefix, s, d.suffix].filter(s => s && s.length > 0).join("-"),
    f = s => s || h(d.precache),
    l = s => s || h(d.runtime);

function u(s) {
    s.then(() => {})
}
const x = new Set;
class j {
    constructor(s, e, {
        onupgradeneeded: c,
        onversionchange: a
    } = {}) {
        this.o = null, this.g = s, this.h = e, this.l = c, this.u = a || (() => this.close())
    }
    get db() {
        return this.o
    }
    async open() {
        if (!this.o) return this.o = await new Promise((s, e) => {
            let c = !1;
            setTimeout(() => {
                c = !0, e(new Error("The open request was blocked and timed out"))
            }, this.OPEN_TIMEOUT);
            const a = indexedDB.open(this.g, this.h);
            a.onerror = () => e(a.error), a.onupgradeneeded = s => {
                c ? (a.transaction.abort(), a.result.close()) : "function" == typeof this.l && this.l(s)
            }, a.onsuccess = () => {
                const e = a.result;
                c ? e.close() : (e.onversionchange = this.u.bind(this), s(e))
            }
        }), this
    }
    async getKey(s, e) {
        return (await this.getAllKeys(s, e, 1))[0]
    }
    async getAll(s, e, c) {
        return await this.getAllMatching(s, {
            query: e,
            count: c
        })
    }
    async getAllKeys(s, e, c) {
        return (await this.getAllMatching(s, {
            query: e,
            count: c,
            includeKeys: !0
        })).map(s => s.key)
    }
    async getAllMatching(s, {
        index: e,
        query: c = null,
        direction: a = "next",
        count: t,
        includeKeys: n = !1
    } = {}) {
        return await this.transaction([s], "readonly", (i, r) => {
            const o = i.objectStore(s),
                g = e ? o.index(e) : o,
                d = [],
                h = g.openCursor(c, a);
            h.onsuccess = () => {
                const s = h.result;
                s ? (d.push(n ? s : s.value), t && d.length >= t ? r(d) : s.continue()) : r(d)
            }
        })
    }
    async transaction(s, e, c) {
        return await this.open(), await new Promise((a, t) => {
            const n = this.o.transaction(s, e);
            n.onabort = () => t(n.error), n.oncomplete = () => a(), c(n, s => a(s))
        })
    }
    async j(s, e, c, ...a) {
        return await this.transaction([e], c, (c, t) => {
            const n = c.objectStore(e),
                i = n[s].apply(n, a);
            i.onsuccess = () => t(i.result)
        })
    }
    close() {
        this.o && (this.o.close(), this.o = null)
    }
}
j.prototype.OPEN_TIMEOUT = 2e3;
const p = {
    readonly: ["get", "count", "getKey", "getAll", "getAllKeys"],
    readwrite: ["add", "put", "clear", "delete"]
};
for (const [s, e] of Object.entries(p))
    for (const c of e) c in IDBObjectStore.prototype && (j.prototype[c] = async function(e, ...a) {
        return await this.j(c, e, s, ...a)
    });
try {
    self["workbox:expiration:5.1.3"] && _()
} catch (s) {}
const b = s => {
    const e = new URL(s, location.href);
    return e.hash = "", e.href
};
class m {
    constructor(s) {
        this.p = s, this.o = new j("workbox-expiration", 1, {
            onupgradeneeded: s => this.m(s)
        })
    }
    m(s) {
        const e = s.target.result.createObjectStore("cache-entries", {
            keyPath: "id"
        });
        e.createIndex("cacheName", "cacheName", {
            unique: !1
        }), e.createIndex("timestamp", "timestamp", {
            unique: !1
        }), (async s => {
            await new Promise((e, c) => {
                const a = indexedDB.deleteDatabase(s);
                a.onerror = () => {
                    c(a.error)
                }, a.onblocked = () => {
                    c(new Error("Delete blocked"))
                }, a.onsuccess = () => {
                    e()
                }
            })
        })(this.p)
    }
    async setTimestamp(s, e) {
        const c = {
            url: s = b(s),
            timestamp: e,
            cacheName: this.p,
            id: this.v(s)
        };
        await this.o.put("cache-entries", c)
    }
    async getTimestamp(s) {
        return (await this.o.get("cache-entries", this.v(s))).timestamp
    }
    async expireEntries(s, e) {
        const c = await this.o.transaction("cache-entries", "readwrite", (c, a) => {
                const t = c.objectStore("cache-entries").index("timestamp").openCursor(null, "prev"),
                    n = [];
                let i = 0;
                t.onsuccess = () => {
                    const c = t.result;
                    if (c) {
                        const a = c.value;
                        a.cacheName === this.p && (s && a.timestamp < s || e && i >= e ? n.push(c.value) : i++), c.continue()
                    } else a(n)
                }
            }),
            a = [];
        for (const s of c) await this.o.delete("cache-entries", s.id), a.push(s.url);
        return a
    }
    v(s) {
        return this.p + "|" + b(s)
    }
}
class v {
    constructor(s, e = {}) {
        this._ = !1, this.k = !1, this.q = e.maxEntries, this.R = e.maxAgeSeconds, this.p = s, this.U = new m(s)
    }
    async expireEntries() {
        if (this._) return void(this.k = !0);
        this._ = !0;
        const s = this.R ? Date.now() - 1e3 * this.R : 0,
            e = await this.U.expireEntries(s, this.q),
            c = await self.caches.open(this.p);
        for (const s of e) await c.delete(s);
        this._ = !1, this.k && (this.k = !1, u(this.expireEntries()))
    }
    async updateTimestamp(s) {
        await this.U.setTimestamp(s, Date.now())
    }
    async isURLExpired(s) {
        if (this.R) {
            return await this.U.getTimestamp(s) < Date.now() - 1e3 * this.R
        }
        return !1
    }
    async delete() {
        this.k = !1, await this.U.expireEntries(1 / 0)
    }
}
class k {
    constructor(s = {}) {
        var e;
        this.cachedResponseWillBeUsed = async ({
            event: s,
            request: e,
            cacheName: c,
            cachedResponse: a
        }) => {
            if (!a) return null;
            const t = this.L(a),
                n = this.N(c);
            u(n.expireEntries());
            const i = n.updateTimestamp(e.url);
            if (s) try {
                s.waitUntil(i)
            } catch (s) {}
            return t ? a : null
        }, this.cacheDidUpdate = async ({
            cacheName: s,
            request: e
        }) => {
            const c = this.N(s);
            await c.updateTimestamp(e.url), await c.expireEntries()
        }, this.T = s, this.R = s.maxAgeSeconds, this.O = new Map, s.purgeOnQuotaError && (e = () => this.deleteCacheAndMetadata(), x.add(e))
    }
    N(s) {
        if (s === l()) throw new e("expire-custom-caches-only");
        let c = this.O.get(s);
        return c || (c = new v(s, this.T), this.O.set(s, c)), c
    }
    L(s) {
        if (!this.R) return !0;
        const e = this.M(s);
        return null === e || e >= Date.now() - 1e3 * this.R
    }
    M(s) {
        if (!s.headers.has("date")) return null;
        const e = s.headers.get("date"),
            c = new Date(e).getTime();
        return isNaN(c) ? null : c
    }
    async deleteCacheAndMetadata() {
        for (const [s, e] of this.O) await self.caches.delete(s), await e.delete();
        this.O = new Map
    }
}
const w = (s, e) => s.filter(s => e in s),
    y = async ({
        request: s,
        mode: e,
        plugins: c = []
    }) => {
        const a = w(c, "cacheKeyWillBeUsed");
        let t = s;
        for (const s of a) t = await s.cacheKeyWillBeUsed.call(s, {
            mode: e,
            request: t
        }), "string" == typeof t && (t = new Request(t));
        return t
    },
    q = async ({
        cacheName: s,
        request: e,
        event: c,
        matchOptions: a,
        plugins: t = []
    }) => {
        const n = await self.caches.open(s),
            i = await y({
                plugins: t,
                request: e,
                mode: "read"
            });
        let r = await n.match(i, a);
        for (const e of t)
            if ("cachedResponseWillBeUsed" in e) {
                const t = e.cachedResponseWillBeUsed;
                r = await t.call(e, {
                    cacheName: s,
                    event: c,
                    matchOptions: a,
                    cachedResponse: r,
                    request: i
                })
            }
        return r
    },
    R = async ({
        cacheName: s,
        request: c,
        response: a,
        event: t,
        plugins: i = [],
        matchOptions: r
    }) => {
        const o = await y({
            plugins: i,
            request: c,
            mode: "write"
        });
        if (!a) throw new e("cache-put-with-no-response", {
            url: n(o.url)
        });
        const g = await (async ({
            request: s,
            response: e,
            event: c,
            plugins: a = []
        }) => {
            let t = e,
                n = !1;
            for (const e of a)
                if ("cacheWillUpdate" in e) {
                    n = !0;
                    const a = e.cacheWillUpdate;
                    if (t = await a.call(e, {
                            request: s,
                            response: t,
                            event: c
                        }), !t) break
                }
            return n || (t = t && 200 === t.status ? t : void 0), t || null
        })({
            event: t,
            plugins: i,
            response: a,
            request: o
        });
        if (!g) return;
        const d = await self.caches.open(s),
            h = w(i, "cacheDidUpdate"),
            f = h.length > 0 ? await q({
                cacheName: s,
                matchOptions: r,
                request: o
            }) : null;
        try {
            await d.put(o, g)
        } catch (s) {
            throw "QuotaExceededError" === s.name && await async function() {
                for (const s of x) await s()
            }(), s
        }
        for (const e of h) await e.cacheDidUpdate.call(e, {
            cacheName: s,
            event: t,
            oldResponse: f,
            newResponse: g,
            request: o
        })
    },
    U = q,
    E = async ({
        request: s,
        fetchOptions: c,
        event: a,
        plugins: t = []
    }) => {
        if ("string" == typeof s && (s = new Request(s)), a instanceof FetchEvent && a.preloadResponse) {
            const s = await a.preloadResponse;
            if (s) return s
        }
        const n = w(t, "fetchDidFail"),
            i = n.length > 0 ? s.clone() : null;
        try {
            for (const e of t)
                if ("requestWillFetch" in e) {
                    const c = e.requestWillFetch,
                        t = s.clone();
                    s = await c.call(e, {
                        request: t,
                        event: a
                    })
                }
        } catch (s) {
            throw new e("plugin-error-request-will-fetch", {
                thrownError: s
            })
        }
        const r = s.clone();
        try {
            let e;
            e = "navigate" === s.mode ? await fetch(s) : await fetch(s, c);
            for (const s of t) "fetchDidSucceed" in s && (e = await s.fetchDidSucceed.call(s, {
                event: a,
                request: r,
                response: e
            }));
            return e
        } catch (s) {
            for (const e of n) await e.fetchDidFail.call(e, {
                error: s,
                event: a,
                originalRequest: i.clone(),
                request: r.clone()
            });
            throw s
        }
    };
try {
    self["workbox:strategies:5.1.3"] && _()
} catch (s) {}
const L = {
    cacheWillUpdate: async ({
        response: s
    }) => 200 === s.status || 0 === s.status ? s : null
};
class N {
    constructor(s = {}) {
        if (this.p = l(s.cacheName), this.S = s.plugins || [], s.plugins) {
            const e = s.plugins.some(s => !!s.cacheWillUpdate);
            this.S = e ? s.plugins : [L, ...s.plugins]
        } else this.S = [L];
        this.K = s.fetchOptions, this.A = s.matchOptions
    }
    async handle({
        event: s,
        request: c
    }) {
        "string" == typeof c && (c = new Request(c));
        const a = this.C({
            request: c,
            event: s
        });
        let t, n = await U({
            cacheName: this.p,
            request: c,
            event: s,
            matchOptions: this.A,
            plugins: this.S
        });
        if (n) {
            if (s) try {
                s.waitUntil(a)
            } catch (t) {}
        } else try {
            n = await a
        } catch (s) {
            t = s
        }
        if (!n) throw new e("no-response", {
            url: c.url,
            error: t
        });
        return n
    }
    async C({
        request: s,
        event: e
    }) {
        const c = await E({
                request: s,
                event: e,
                fetchOptions: this.K,
                plugins: this.S
            }),
            a = R({
                cacheName: this.p,
                request: s,
                response: c.clone(),
                event: e,
                plugins: this.S
            });
        if (e) try {
            e.waitUntil(a)
        } catch (s) {}
        return c
    }
}
let T;
async function O(s, e) {
    const c = s.clone(),
        a = {
            headers: new Headers(c.headers),
            status: c.status,
            statusText: c.statusText
        },
        t = e ? e(a) : a,
        n = function() {
            if (void 0 === T) {
                const s = new Response("");
                if ("body" in s) try {
                    new Response(s.body), T = !0
                } catch (s) {
                    T = !1
                }
                T = !1
            }
            return T
        }() ? c.body : await c.blob();
    return new Response(n, t)
}
try {
    self["workbox:precaching:5.1.3"] && _()
} catch (s) {}

function M(s) {
    if (!s) throw new e("add-to-cache-list-unexpected-type", {
        entry: s
    });
    if ("string" == typeof s) {
        const e = new URL(s, location.href);
        return {
            cacheKey: e.href,
            url: e.href
        }
    }
    const {
        revision: c,
        url: a
    } = s;
    if (!a) throw new e("add-to-cache-list-unexpected-type", {
        entry: s
    });
    if (!c) {
        const s = new URL(a, location.href);
        return {
            cacheKey: s.href,
            url: s.href
        }
    }
    const t = new URL(a, location.href),
        n = new URL(a, location.href);
    return t.searchParams.set("__WB_REVISION__", c), {
        cacheKey: t.href,
        url: n.href
    }
}
class S {
    constructor(s) {
        this.p = f(s), this.D = new Map, this.P = new Map, this.B = new Map
    }
    addToCacheList(s) {
        const c = [];
        for (const a of s) {
            "string" == typeof a ? c.push(a) : a && void 0 === a.revision && c.push(a.url);
            const {
                cacheKey: s,
                url: t
            } = M(a), n = "string" != typeof a && a.revision ? "reload" : "default";
            if (this.D.has(t) && this.D.get(t) !== s) throw new e("add-to-cache-list-conflicting-entries", {
                firstEntry: this.D.get(t),
                secondEntry: s
            });
            if ("string" != typeof a && a.integrity) {
                if (this.B.has(s) && this.B.get(s) !== a.integrity) throw new e("add-to-cache-list-conflicting-integrities", {
                    url: t
                });
                this.B.set(s, a.integrity)
            }
            if (this.D.set(t, s), this.P.set(t, n), c.length > 0) {
                const s = `Workbox is precaching URLs without revision info: ${c.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
                console.warn(s)
            }
        }
    }
    async install({
        event: s,
        plugins: e
    } = {}) {
        const c = [],
            a = [],
            t = await self.caches.open(this.p),
            n = await t.keys(),
            i = new Set(n.map(s => s.url));
        for (const [s, e] of this.D) i.has(e) ? a.push(s) : c.push({
            cacheKey: e,
            url: s
        });
        const r = c.map(({
            cacheKey: c,
            url: a
        }) => {
            const t = this.B.get(c),
                n = this.P.get(a);
            return this.G({
                cacheKey: c,
                cacheMode: n,
                event: s,
                integrity: t,
                plugins: e,
                url: a
            })
        });
        return await Promise.all(r), {
            updatedURLs: c.map(s => s.url),
            notUpdatedURLs: a
        }
    }
    async activate() {
        const s = await self.caches.open(this.p),
            e = await s.keys(),
            c = new Set(this.D.values()),
            a = [];
        for (const t of e) c.has(t.url) || (await s.delete(t), a.push(t.url));
        return {
            deletedURLs: a
        }
    }
    async G({
        cacheKey: s,
        url: c,
        cacheMode: a,
        event: t,
        plugins: n,
        integrity: i
    }) {
        const r = new Request(c, {
            integrity: i,
            cache: a,
            credentials: "same-origin"
        });
        let o, g = await E({
            event: t,
            plugins: n,
            request: r
        });
        for (const s of n || []) "cacheWillUpdate" in s && (o = s);
        if (!(o ? await o.cacheWillUpdate({
                event: t,
                request: r,
                response: g
            }) : g.status < 400)) throw new e("bad-precaching-response", {
            url: c,
            status: g.status
        });
        g.redirected && (g = await O(g)), await R({
            event: t,
            plugins: n,
            response: g,
            request: s === c ? r : new Request(s),
            cacheName: this.p,
            matchOptions: {
                ignoreSearch: !0
            }
        })
    }
    getURLsToCacheKeys() {
        return this.D
    }
    getCachedURLs() {
        return [...this.D.keys()]
    }
    getCacheKeyForURL(s) {
        const e = new URL(s, location.href);
        return this.D.get(e.href)
    }
    async matchPrecache(s) {
        const e = s instanceof Request ? s.url : s,
            c = this.getCacheKeyForURL(e);
        if (c) {
            return (await self.caches.open(this.p)).match(c)
        }
    }
    createHandler(s = !0) {
        return async ({
            request: c
        }) => {
            try {
                const s = await this.matchPrecache(c);
                if (s) return s;
                throw new e("missing-precache-entry", {
                    cacheName: this.p,
                    url: c instanceof Request ? c.url : c
                })
            } catch (e) {
                if (s) return fetch(c);
                throw e
            }
        }
    }
    createHandlerBoundToURL(s, c = !0) {
        if (!this.getCacheKeyForURL(s)) throw new e("non-precached-url", {
            url: s
        });
        const a = this.createHandler(c),
            t = new Request(s);
        return () => a({
            request: t
        })
    }
}
let z;
const K = () => (z || (z = new S), z);
const A = (s, e) => {
    const c = K().getURLsToCacheKeys();
    for (const a of function*(s, {
            ignoreURLParametersMatching: e,
            directoryIndex: c,
            cleanURLs: a,
            urlManipulation: t
        } = {}) {
            const n = new URL(s, location.href);
            n.hash = "", yield n.href;
            const i = function(s, e = []) {
                for (const c of [...s.searchParams.keys()]) e.some(s => s.test(c)) && s.searchParams.delete(c);
                return s
            }(n, e);
            if (yield i.href, c && i.pathname.endsWith("/")) {
                const s = new URL(i.href);
                s.pathname += c, yield s.href
            }
            if (a) {
                const s = new URL(i.href);
                s.pathname += ".html", yield s.href
            }
            if (t) {
                const s = t({
                    url: n
                });
                for (const e of s) yield e.href
            }
        }(s, e)) {
        const s = c.get(a);
        if (s) return s
    }
};
let C = !1;

function D(s) {
    C || ((({
        ignoreURLParametersMatching: s = [/^utm_/],
        directoryIndex: e = "index.html",
        cleanURLs: c = !0,
        urlManipulation: a
    } = {}) => {
        const t = f();
        self.addEventListener("fetch", n => {
            const i = A(n.request.url, {
                cleanURLs: c,
                directoryIndex: e,
                ignoreURLParametersMatching: s,
                urlManipulation: a
            });
            if (!i) return;
            let r = self.caches.open(t).then(s => s.match(i)).then(s => s || fetch(i));
            n.respondWith(r)
        })
    })(s), C = !0)
}
const P = [],
    B = {
        get: () => P,
        add(s) {
            P.push(...s)
        }
    },
    G = s => {
        const e = K(),
            c = B.get();
        s.waitUntil(e.install({
            event: s,
            plugins: c
        }).catch(s => {
            throw s
        }))
    },
    I = s => {
        const e = K();
        s.waitUntil(e.activate())
    };
var W;
self.addEventListener("message", s => {
        s.data && "SKIP_WAITING" === s.data.type && self.skipWaiting()
    }), W = {},
    function(s) {
        K().addToCacheList(s), s.length > 0 && (self.addEventListener("install", G), self.addEventListener("activate", I))
    }([{
        url: "_next/static/chunks/1.bb0fc05663243ecb9696.js",
        revision: "c050490709d38676ca0ac6e23f027da2"
    }, {
        url: "_next/static/chunks/2.4d3ea45c89b7d939afd7.js",
        revision: "07077e284aff965fcbd003a4010e2633"
    }, {
        url: "_next/static/chunks/206.97bfa6994be6dc168fd2.js",
        revision: "7b518fdf0fe985aafe4eb46d78e2a01c"
    }, {
        url: "_next/static/chunks/207.f1c35fd582042d714030.js",
        revision: "9d5792ac9e926f8d87b70c47020982de"
    }, {
        url: "_next/static/chunks/208.564ad42158530c62ace2.js",
        revision: "d186306b6757b83f497b25f4fb6ef470"
    }, {
        url: "_next/static/chunks/209.29b15b6d64fa06bc9787.js",
        revision: "c2e93e98d684924cdfcdb9b05044cbc4"
    }, {
        url: "_next/static/chunks/210.28e8bac730faeb3335b4.js",
        revision: "c3458da4967d1f72154832e7f2ad7c5a"
    }, {
        url: "_next/static/chunks/211.99675eae4d57c8a80fae.js",
        revision: "ebf73381bfa1d2dc2d2db73a623600e6"
    }, {
        url: "_next/static/chunks/212.0267a2ea910f31cb3d0a.js",
        revision: "a6e779c8b25e5528df9a9815f99cb2c2"
    }, {
        url: "_next/static/chunks/213.e5aedb15bea4de0a2dc6.js",
        revision: "b2a05ecc981d524ef0cd8ae5e5372955"
    }, {
        url: "_next/static/chunks/3.ca3fb4d5a19e3c75e265.js",
        revision: "31ce9bd53e821b2caeda36168ea84b66"
    }, {
        url: "_next/static/css/208.xg2hrnmcj.chunk.css",
        revision: "0d4c5b7d11a22340bc7403515074c7db"
    }, {
        url: "_next/static/css/209.xg2hrnmcj.chunk.css",
        revision: "e6bf90d39e7c4856a79b3132418c4b15"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/3d-photo-printings.js.xg2hrnmcj.chunk.css",
        revision: "c2dc1520e331f6f88a6ac5fede27f39a"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/404.js.xg2hrnmcj.chunk.css",
        revision: "774b0ec353bdbf4c0692a62665a1911d"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/500.js.xg2hrnmcj.chunk.css",
        revision: "774b0ec353bdbf4c0692a62665a1911d"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/[slug].js.xg2hrnmcj.chunk.css",
        revision: "88e131caa0f7cee552eb69e3dc0574a5"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/_app.js.xg2hrnmcj.chunk.css",
        revision: "2d4a68012ed598495fe4877779934b68"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/_error.js.xg2hrnmcj.chunk.css",
        revision: "774b0ec353bdbf4c0692a62665a1911d"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/acrylic-photo-blocks.js.xg2hrnmcj.chunk.css",
        revision: "94f24db388b132a1df97c27d3d84a48b"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/acrylic-prints.js.xg2hrnmcj.chunk.css",
        revision: "c8380e624cdac0ea48b3bd77c21f0b3f"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/anniversary-gifts.js.xg2hrnmcj.chunk.css",
        revision: "d8a50f6fa733d89f752df4805304b9ec"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/birthday-gifts.js.xg2hrnmcj.chunk.css",
        revision: "727a8081e3314e22a3958c85421ebed2"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/blog/blog.js.xg2hrnmcj.chunk.css",
        revision: "60a1d66e7d57fb20682c076572483c2d"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/blog/blogDetail.js.xg2hrnmcj.chunk.css",
        revision: "37455fe23517b6fd24f6a6c0436c4364"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/bookmarks/bookmarks.js.xg2hrnmcj.chunk.css",
        revision: "75f47ffef102ff1f8a28d378df83a853"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/bus-rolls.js.xg2hrnmcj.chunk.css",
        revision: "b0605d83c11d0d92bdbc6ed8671088c4"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/canvas-banners.js.xg2hrnmcj.chunk.css",
        revision: "90dab84f09bf75728a4bbe91bbd9f6ec"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/canvas-prints.js.xg2hrnmcj.chunk.css",
        revision: "8933a4a6ddd4fa68d2fbb1f1b36a8fc1"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/canvas-wall-displays.js.xg2hrnmcj.chunk.css",
        revision: "4eb8848234378595b51f0ebfcd40e1f9"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/cart/ToolTip.js.xg2hrnmcj.chunk.css",
        revision: "417d7eeaf0883838973f911f89ca9719"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/cart/cart.js.xg2hrnmcj.chunk.css",
        revision: "aecdce8a99173ee2331c10eb0d401451"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/checkout/artwork-proof.js.xg2hrnmcj.chunk.css",
        revision: "5c149345f353081cc3c4e79262cd65a9"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/checkout/checkout.js.xg2hrnmcj.chunk.css",
        revision: "3298c499b54dd7507f05540dc5ca2a1f"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/checkout/orderproof.js.xg2hrnmcj.chunk.css",
        revision: "f369b1841dd65b160a22461398ca489a"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/checkout/success.js.xg2hrnmcj.chunk.css",
        revision: "a7f9dc1ecc96e31c150f87564b702465"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/christmas-gifts.js.xg2hrnmcj.chunk.css",
        revision: "e99b58a5686829dfe7489af02ff0a06d"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/coasters.js.xg2hrnmcj.chunk.css",
        revision: "e2f29f42cea9a8c1f5615629c21ded58"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/collage-gifts.js.xg2hrnmcj.chunk.css",
        revision: "633c79cd0fb97b64cbd060dc33affca4"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/contact-us.js.xg2hrnmcj.chunk.css",
        revision: "80cb607bc730bd6144b8acadd9c332a3"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/corona-keychain/corona-keychain.js.xg2hrnmcj.chunk.css",
        revision: "c7ece14a74686218ea9d52c71cf68b92"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/corporate-gifts.js.xg2hrnmcj.chunk.css",
        revision: "002e319e0ed63602ad9266b45833750e"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/coupon-partners.js.xg2hrnmcj.chunk.css",
        revision: "7a6700ef721515fe12b6aff726980c85"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/createaccount/createaccount.js.xg2hrnmcj.chunk.css",
        revision: "0b88a1c56cf910d5e59d8d82f5b7db41"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-3d-crystal-cube.js.xg2hrnmcj.chunk.css",
        revision: "14a8038e58e3a923279252d9ca03a413"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-apron.js.xg2hrnmcj.chunk.css",
        revision: "208dccd2af1cd6ece3774df30b727b57"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-caricature-photo-stand.js.xg2hrnmcj.chunk.css",
        revision: "bc5ae483cae0952478e6282e7bc9b70f"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-caricature.js.xg2hrnmcj.chunk.css",
        revision: "03e52b37cb89169f09721503e51df2d8"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-chopping-board.js.xg2hrnmcj.chunk.css",
        revision: "e38d8d1c654172541e3b25599b9d8f0c"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-diary/custom-diary.js.xg2hrnmcj.chunk.css",
        revision: "a6e21cfdc1aadc737c36665a327d1bbe"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-love-music-plaques.js.xg2hrnmcj.chunk.css",
        revision: "a2f53dca20de50ecc989c79dbdd73387"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-luggage-tags/custom-luggage-tags.js.xg2hrnmcj.chunk.css",
        revision: "c26d4de1f6147a630414ba497ccd2ecf"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-moon-lamps.js.xg2hrnmcj.chunk.css",
        revision: "e132777176834034e14d8e4251956508"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-mouse-pads.js.xg2hrnmcj.chunk.css",
        revision: "b15863ebac7f16678e85af3b1e616bbb"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-pen-drives.js.xg2hrnmcj.chunk.css",
        revision: "b1b6c78636e7d4414dc1426cc4354ab3"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-pet-shaped-pillow/custom-pet-shaped-pillow.js.xg2hrnmcj.chunk.css",
        revision: "b356bc3ac4b3cfc733bc0eb9c4503b58"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-photo-socks/custom-photo-socks.js.xg2hrnmcj.chunk.css",
        revision: "cf05b3d4c8b245dd9e3c22705bf1cf94"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-photo-umbrella.js.xg2hrnmcj.chunk.css",
        revision: "cd62e6f276885a6ad973070bbf6df08a"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-power-bank.js.xg2hrnmcj.chunk.css",
        revision: "97727095ae4049bafec0dea7973bf907"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-printed-yoga-mats.js.xg2hrnmcj.chunk.css",
        revision: "93c35473a0abe4b5bf897112b43c3a29"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-sequin-pillow/custom-sequin-pillow.js.xg2hrnmcj.chunk.css",
        revision: "6592ca66fbd43a6630bf34acf613c5d6"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-song-lyrics-on-canvas.js.xg2hrnmcj.chunk.css",
        revision: "4c15ea4ca251462672dd22ec596ac944"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/custom-table-mats.js.xg2hrnmcj.chunk.css",
        revision: "1338bc69d9c9c420ebde821f5b78e19b"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/desk-calendar.js.xg2hrnmcj.chunk.css",
        revision: "e7bae396c7d7c052a52d76c0144bb7e7"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/didactic-game/didactic-game.js.xg2hrnmcj.chunk.css",
        revision: "98cca8d7906ba4cd9e0e462294c3b536"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/diwali-gifts.js.xg2hrnmcj.chunk.css",
        revision: "1fe122505344ff5727243722fb3d8698"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/double-layer-acrylic-frames.js.xg2hrnmcj.chunk.css",
        revision: "6c05a0d576dc1f935e525aaf8737272c"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/fathers-day-gifts.js.xg2hrnmcj.chunk.css",
        revision: "8d15d3223ed421df3686563f9f614021"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/forgotpassword/forgotpassword.js.xg2hrnmcj.chunk.css",
        revision: "f590c2d49ecb2ee4fdfa58468d47e008"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/framed-prints.js.xg2hrnmcj.chunk.css",
        revision: "64825ab5a0e7ccadd3fb55891a763a20"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/friendship-day-gifts.js.xg2hrnmcj.chunk.css",
        revision: "64418d752a95a4ea89c041ece2072cd1"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/giftcertificate/giftcertificate.js.xg2hrnmcj.chunk.css",
        revision: "24dbe52cf64cf2f8e07a116ef36937d4"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/giftcertificate/updateGiftCertificate.js.xg2hrnmcj.chunk.css",
        revision: "24dbe52cf64cf2f8e07a116ef36937d4"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/heart-shaped-moon-lamp/heart-shaped-moon-lamp.js.xg2hrnmcj.chunk.css",
        revision: "620cabd7cd8847c8a6e410dbd6aaa36f"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/hexagon-canvas.js.xg2hrnmcj.chunk.css",
        revision: "8382e8836e93745266cac53cc22bf1b8"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/index.js.xg2hrnmcj.chunk.css",
        revision: "ed50b663119688adf7b4b3b1f0eeeafe"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/inspiration-gallery/inspiration-gallery.js.xg2hrnmcj.chunk.css",
        revision: "ca72315e816da526e22d419c9d0808e8"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/interior-home-decoration.js.xg2hrnmcj.chunk.css",
        revision: "9452fad18f2857636bc4f0a582a04009"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/2-panel-canvas-wall-art/2-panel-canvas-wall-art.js.xg2hrnmcj.chunk.css",
        revision: "33592f0c5cb385ba984107939f015577"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/accessories/accessories.js.xg2hrnmcj.chunk.css",
        revision: "e625e25bb03af9ac01347428729a754a"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/affiliate/affiliate.js.xg2hrnmcj.chunk.css",
        revision: "8435fb3a89cd6b712fc05518c5a65a37"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/andy-warhol-canvas/andy-warhol-canvas.js.xg2hrnmcj.chunk.css",
        revision: "e8d2953426c50f0eb1454be4f48c882a"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/blank-canvas-panels-boards/blank-canvas-panels-boards.js.xg2hrnmcj.chunk.css",
        revision: "88c96cd04c110026c33dc72a4f697000"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/blank-stretched-canvas/blank-stretched-canvas.js.xg2hrnmcj.chunk.css",
        revision: "09f898467aa0fafc58d44e482a692b17"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/brandbassador/brandbassador.js.xg2hrnmcj.chunk.css",
        revision: "22135e55a639b828b390fe0322d1c8b9"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/buy-now-create-later/buy-now-create-later.js.xg2hrnmcj.chunk.css",
        revision: "fb25b244667ac374e414c4d4cb2ca963"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/canvas-edges/canvas-edges.js.xg2hrnmcj.chunk.css",
        revision: "362cc3d7ed7967ada19a42b31ba37381"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/canvas-floater-frames/canvas-floater-frames.js.xg2hrnmcj.chunk.css",
        revision: "c5d7897229b37470fb0079609cecc0e2"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/canvas-pads/canvas-pads.js.xg2hrnmcj.chunk.css",
        revision: "ad43a2e531cb509c02578d832b6f01e3"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/canvas-photo-retouching/canvas-photo-retouching.js.xg2hrnmcj.chunk.css",
        revision: "5f6d87522aa21b1286e4308447a5fa7f"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/corporate-art/corporate-art.js.xg2hrnmcj.chunk.css",
        revision: "f9614578f1d85ef7b51251100248d21d"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/coupons-deals/coupons-deals.js.xg2hrnmcj.chunk.css",
        revision: "369edd682f608fb354706262232113e9"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/custom-flip-flops/custom-flip-flops.js.xg2hrnmcj.chunk.css",
        revision: "2708e0745327fb672e065a64c188d0c2"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/custom-woven-blankets/ProductGridCustomWownBlankets.js.xg2hrnmcj.chunk.css",
        revision: "e93a45463b9170f91f03170deecf31d2"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/custom-woven-blankets/custom-woven-blankets.js.xg2hrnmcj.chunk.css",
        revision: "728aca287e4755916af2b89378b3c108"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/customer-reviews/customer-reviews.js.xg2hrnmcj.chunk.css",
        revision: "86cf1d449d61cadbd57d2cb9933749ee"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/customer-showcase/customer-showcase.js.xg2hrnmcj.chunk.css",
        revision: "d72a69a0f7e5d71767397aa695d9a4b4"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/digital-oil-painting/digital-oil-painting.js.xg2hrnmcj.chunk.css",
        revision: "6121d69eb19116614fc1530b57e74e7a"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/easel-stands/easel-stands.js.xg2hrnmcj.chunk.css",
        revision: "3bcbffa637a998e9cf143c5d583555b6"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/easel-stands/order-es.js.xg2hrnmcj.chunk.css",
        revision: "8db4d2348e9e85d7fa65a99c14ed6d89"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/emoji-prints/emoji-prints.js.xg2hrnmcj.chunk.css",
        revision: "400df98d987c1af6d64dbb89751aa671"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/engraved-photos/engraved-photos.js.xg2hrnmcj.chunk.css",
        revision: "91f77eb2aa1317a02dc403071030b587"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/facebook-canvas-photo-prints/facebook-canvas-photo-prints.js.xg2hrnmcj.chunk.css",
        revision: "c94c5e30a09e6ae2d15367878ec206fd"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/facebook-offer/facebook-offer.js.xg2hrnmcj.chunk.css",
        revision: "924bae81d37bf2b8f7daa3b243a2ff23"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/famous-artist/famous-artist.js.xg2hrnmcj.chunk.css",
        revision: "3e8036a06ab7d7125e3374cf108d2521"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/filter-and-effects/filter-and-effects.js.xg2hrnmcj.chunk.css",
        revision: "4a0b3ce17d55d01a679097d182e31897"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/framed-canvas/framed-canvas.js.xg2hrnmcj.chunk.css",
        revision: "63378bf63ab3d94bb7fc01f867fb7836"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/frames/frames.js.xg2hrnmcj.chunk.css",
        revision: "7934162f8f78729226216d5c6d361296"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/free-canvas-prints/free-canvas-prints.js.xg2hrnmcj.chunk.css",
        revision: "e2c76d84fd783431a4f361821ad3631d"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/free-canvas/free-canvas.js.xg2hrnmcj.chunk.css",
        revision: "f41f2ea97f0b97c9a6cd820f3a4b8464"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/free-photo-canvas/free-photo-canvas.js.xg2hrnmcj.chunk.css",
        revision: "7dac56c7b8abb46483cbbf7cbab26d7c"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/free-photoengraved/free-photoengraved.js.xg2hrnmcj.chunk.css",
        revision: "2744b9eb0b63e09ed0f77aa4eff4d927"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/free-pillow/free-pillow.js.xg2hrnmcj.chunk.css",
        revision: "158fe4b06d53a1b45eb214b6a941e14a"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/gallery-wrapped-canvas/gallery-wrapped-canvas.js.xg2hrnmcj.chunk.css",
        revision: "222840390e3eb9e42b249dbf8897c5b1"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/giclee-canvas-printing/giclee-canvas-printing.js.xg2hrnmcj.chunk.css",
        revision: "50f3f278bf6736053f866a3ca8a179c4"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/giving-programs/giving-programs.js.xg2hrnmcj.chunk.css",
        revision: "3150f70af6f190bad46fbac4a923ee0e"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/groupondeals/groupondeals.js.xg2hrnmcj.chunk.css",
        revision: "0f49ab2d672b439bb9c3422c7c5ebd78"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/hanging-canvas/hanging-canvas.js.xg2hrnmcj.chunk.css",
        revision: "9a1f1b41be8004998412d8336e5bcc92"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/id-me/id-me.js.xg2hrnmcj.chunk.css",
        revision: "f1a65621ff25dcc2e1e903bf91507ab3"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/insta-promotion/insta-promotion.js.xg2hrnmcj.chunk.css",
        revision: "9f290f240ef4d82a7e885d8a19ff0824"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/instagram-canvas-photo-prints/instagram-canvas-photo-prints.js.xg2hrnmcj.chunk.css",
        revision: "ac2d4b19ea3d2e40afa45e42a25d05f8"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/magic-mugs/magic-mugs.js.xg2hrnmcj.chunk.css",
        revision: "1665d29a8145c60ff5908536373f75f2"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/mini-canvas-prints/mini-canvas-prints.js.xg2hrnmcj.chunk.css",
        revision: "fedf1ba89a574f4655435fe99c6140f3"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/new-york-canvas-prints/new-york-canvas-prints.js.xg2hrnmcj.chunk.css",
        revision: "f8f7cb716c7a30b2829b794ac5eab63b"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/order-api/order-api.js.xg2hrnmcj.chunk.css",
        revision: "8973f37b6efb581717eadff797b9290d"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/personalized-fathers-day-gifts/personalized-fathers-day-gifts.js.xg2hrnmcj.chunk.css",
        revision: "a49cf997ec496b8e7f639e593ba27ae4"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/photo-blankets/photo-blankets.js.xg2hrnmcj.chunk.css",
        revision: "2f8df22231893c8a725e162f29006ba6"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/photo-boards/photo-boards.js.xg2hrnmcj.chunk.css",
        revision: "57f19511ad755cc3db8cadc7e11cd81a"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/photo-calendars/photo-calendars.js.xg2hrnmcj.chunk.css",
        revision: "78f40bd8e638803f819225d02dcb01f9"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/photo-enlargements/photo-enlargements.js.xg2hrnmcj.chunk.css",
        revision: "e6468bedc127af3a1ddfee060c395493"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/photo-gifts/photo-gifts.js.xg2hrnmcj.chunk.css",
        revision: "e0874d65df826c86384070e67f26514e"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/photo-ornaments/photo-ornaments.js.xg2hrnmcj.chunk.css",
        revision: "1498390f67d26f98545f4a12317e4645"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/photographers/photographers.js.xg2hrnmcj.chunk.css",
        revision: "33e775e668c3b5ae601fe624eeb8c844"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/photos-on-canvas/photos-on-canvas.js.xg2hrnmcj.chunk.css",
        revision: "ba584aac174d12fe600077a21e00b7d3"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/prisma-photo-prints/prisma-photo-prints.js.xg2hrnmcj.chunk.css",
        revision: "ab1079ad9ba6eaefa4b520c008e35873"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/quality-canvas-printing/quality-canvas-printing.js.xg2hrnmcj.chunk.css",
        revision: "5a8412c770f40dacf2205769fa903bb3"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/quoteoncanvas/quote-on-canvas.js.xg2hrnmcj.chunk.css",
        revision: "21c8610e78d160ac07750d1e24c7b6c3"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/reward-program/reward-program.js.xg2hrnmcj.chunk.css",
        revision: "f2aa317311773deaa96ce176ea68f2a2"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/rolled-canvas/rolled-canvas.js.xg2hrnmcj.chunk.css",
        revision: "4f6d6daa352f149f155d912fe56d74a2"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/share-photo/share-photo.js.xg2hrnmcj.chunk.css",
        revision: "bdb240ae1b4efb4de9f31d34f2a2ffaa"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/stretcher-bars/commonStretcherBars.js.xg2hrnmcj.chunk.css",
        revision: "bc40a3c98ccd31e217f9b6baf31287ab"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/stretcher-bars/standard-stretcher-bars.js.xg2hrnmcj.chunk.css",
        revision: "bc40a3c98ccd31e217f9b6baf31287ab"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/stretcher-bars/stretcher-bars.js.xg2hrnmcj.chunk.css",
        revision: "f77f4e7b90cdf539a3c4139f9c310d32"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/table-top/table-top.js.xg2hrnmcj.chunk.css",
        revision: "6a057d1478fefb6d70ce9f7060f0fff8"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/triptych-prints/triptych-prints.js.xg2hrnmcj.chunk.css",
        revision: "01f7cda18ede33f2ba4e01d030e0e881"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/wall-decals/wall-decals.js.xg2hrnmcj.chunk.css",
        revision: "53c92b61b3cad6c18dcf65d7f1c38f17"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/landing/what-canvas-print/what-is-a-canvas-print.js.xg2hrnmcj.chunk.css",
        revision: "5c415325bc2bab6e9cf2cf1769d6cb42"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/large-canvas-prints.js.xg2hrnmcj.chunk.css",
        revision: "15287a20fb4369557bd4e27080cbd31b"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/large-metal-prints.js.xg2hrnmcj.chunk.css",
        revision: "d2d4968d2929b8c754e2de41d605003c"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/led-custom-lamp/led-custom-lamp.js.xg2hrnmcj.chunk.css",
        revision: "11f4dd9d4ccb5baaf6e0fae79e22bf99"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/login/login.js.xg2hrnmcj.chunk.css",
        revision: "a89eed2a2bb7b86629f86a9bf7ee2639"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/magic-mugs.js.xg2hrnmcj.chunk.css",
        revision: "9ea18cebcc7ae20a11ff9f554f8cd6ec"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/metal-prints.js.xg2hrnmcj.chunk.css",
        revision: "e4b0397e7afd72f039b70fd984cc5bd9"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/mothers-day-gifts.js.xg2hrnmcj.chunk.css",
        revision: "6e4b7a576660e4a3742309ee519a2841"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/myaccount/myaccount.js.xg2hrnmcj.chunk.css",
        revision: "b3e67919ca456f73827d87fa695ab943"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/new-year-sale-2022.js.xg2hrnmcj.chunk.css",
        revision: "6db5643cad030ebb0b0dcbcdd8811b63"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/panoramic-canvas-photo-prints.js.xg2hrnmcj.chunk.css",
        revision: "8a345670ea3867041fe76b3589e503c1"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/parents-day-gifts.js.xg2hrnmcj.chunk.css",
        revision: "f034cfa1273015d39255cbeacdf142b5"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/personalised-mobile-stand.js.xg2hrnmcj.chunk.css",
        revision: "4145f031185bf22b3e1ad7d4fb98adaf"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/personalised-photo-rakhi.js.xg2hrnmcj.chunk.css",
        revision: "cca3fc1a2ccef1fbf9db165f483b5c9a"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/personalised-pillow-cases.js.xg2hrnmcj.chunk.css",
        revision: "2d975460faf74f296fe9fe88660eca9e"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/personalised-tote-bags.js.xg2hrnmcj.chunk.css",
        revision: "163c34f903101f8fc984b3f608873143"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/personalised-wall-mural.js.xg2hrnmcj.chunk.css",
        revision: "17d91d25cab4cbd35233ff7a0d806460"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/personalized-fathers-day-gift-ideas.js.xg2hrnmcj.chunk.css",
        revision: "21e8dad317e455581ae3ad6765e9a532"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/personalized-photo-gifts.js.xg2hrnmcj.chunk.css",
        revision: "9db851e90afc6103cbbd47a325e4d21f"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/photo-books.js.xg2hrnmcj.chunk.css",
        revision: "1af038d48e1518d6ba88f6c919438b53"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/photo-calendars.js.xg2hrnmcj.chunk.css",
        revision: "78f40bd8e638803f819225d02dcb01f9"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/photo-collage.js.xg2hrnmcj.chunk.css",
        revision: "222fc5d2a3e77c619d62d0fd3f82305d"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/photo-gallery/photo-galleries-view.js.xg2hrnmcj.chunk.css",
        revision: "78b42a16cbf0052c8cb8d5ec22d01dc8"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/photo-gallery/photo-gallery.js.xg2hrnmcj.chunk.css",
        revision: "bd8faf99a82aeaf69e02786fbe1c2e67"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/photo-magnets.js.xg2hrnmcj.chunk.css",
        revision: "7b60d4ca53a122e8a2c33aef54899374"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/photo-mosaic-on-canvas.js.xg2hrnmcj.chunk.css",
        revision: "325350fd44c6b832579976ce4ed3fc49"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/photo-mugs.js.xg2hrnmcj.chunk.css",
        revision: "a76feb0ca3b239fd38894b2237a91b20"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/photo-pillows.js.xg2hrnmcj.chunk.css",
        revision: "7ab2654ca694505ed8e166c8bb685ff4"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/photo-prints.js.xg2hrnmcj.chunk.css",
        revision: "d2d4ab4d030e8b22fa8e10836d540786"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/photo-puzzles.js.xg2hrnmcj.chunk.css",
        revision: "a2b826bd5797f111cee80e8c2060b1f4"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/playing-cards/playing-cards.js.xg2hrnmcj.chunk.css",
        revision: "1762b06fd127a3f1e3a5f45b1523373e"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/pop-art-on-canvas.js.xg2hrnmcj.chunk.css",
        revision: "4714e36a8b0d526b88636a6d51c90527"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/poster-calendar.js.xg2hrnmcj.chunk.css",
        revision: "df1d8554afdb6d2c3d769b4cc86bd564"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/poster-prints.js.xg2hrnmcj.chunk.css",
        revision: "0a7be2f83ec5781a3a134f02e2fff9f4"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/productquestionanswer/productqa.js.xg2hrnmcj.chunk.css",
        revision: "5cbffb370be9ce6a8665a5277b86f97a"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/promotional/InfoCanvasPrint.js.xg2hrnmcj.chunk.css",
        revision: "ee1aec7dd608b67d32d7a92df81a69b2"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/promotional/promotional.js.xg2hrnmcj.chunk.css",
        revision: "1e2a168fe06aaff432a457aace8d73a9"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/promotional/promotionalframedprints.js.xg2hrnmcj.chunk.css",
        revision: "1e2a168fe06aaff432a457aace8d73a9"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/ready-to-hang.js.xg2hrnmcj.chunk.css",
        revision: "d1f638b3e07704c0a01077c56fcbad08"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/refer-a-friend.js.xg2hrnmcj.chunk.css",
        revision: "30e4fa2867105187eb65e510d5f5cee1"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/resetpassword/resetpassword.js.xg2hrnmcj.chunk.css",
        revision: "6fd55608557d74935a9880e4d803b93f"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/rubikcube/rubikcube.js.xg2hrnmcj.chunk.css",
        revision: "b2930c63580d1e614c398290d7a1a803"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/shipping/shipping.js.xg2hrnmcj.chunk.css",
        revision: "489eaafb64ef88cc4e67b6b90cbfe2e9"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/sizes-prices.js.xg2hrnmcj.chunk.css",
        revision: "e986444e20c4dc27c86c4f31e2aa04b6"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/sneeze-guard/sneeze-guard.js.xg2hrnmcj.chunk.css",
        revision: "14824cad1286f3f89e05e668906fed7a"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/split-canvas-prints.js.xg2hrnmcj.chunk.css",
        revision: "88460b7363da3e46034dc51e87a9099e"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/static/page.js.xg2hrnmcj.chunk.css",
        revision: "88e131caa0f7cee552eb69e3dc0574a5"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/valentine-day-gifts.js.xg2hrnmcj.chunk.css",
        revision: "6cba117649228fb3f859c63e3a76c083"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/wall-calendar.js.xg2hrnmcj.chunk.css",
        revision: "481fa611f0487e8a46b7494b58589b11"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/wedding-gifts.js.xg2hrnmcj.chunk.css",
        revision: "84644f3f43f60c4466eab0d98b3ba935"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/wholesale-photo-printing.js.xg2hrnmcj.chunk.css",
        revision: "b30bb225f52d9293f69094b48417d2ed"
    }, {
        url: "_next/static/css/static/xg2hrnmcj/pages/wood-prints.js.xg2hrnmcj.chunk.css",
        revision: "763fe58017c4f06a86a055c26745ac6f"
    }, {
        url: "_next/static/runtime/main-e9571a94d64add19d574.js",
        revision: "f1a877e5361812e21ca25058f9330e05"
    }, {
        url: "_next/static/runtime/polyfills-590de77427f183e74ac9.js",
        revision: "bf0c8de517da9e4c21848efcad0ccb1d"
    }, {
        url: "_next/static/runtime/webpack-e2a2336db562ce16a19a.js",
        revision: "1d0301f4501e04207a604eb99e5615dd"
    }, {
        url: "_next/static/xg2hrnmcj/_buildManifest.js",
        revision: "9784f780c158f23c370a6748d41bbd37"
    }, {
        url: "_next/static/xg2hrnmcj/_ssgManifest.js",
        revision: "abee47769bf307639ace4945f9cfd4ff"
    }, {
        url: "_next/static/xg2hrnmcj/pages/3d-photo-printings.js",
        revision: "e5afba134bb41bd901009a6370f5f06c"
    }, {
        url: "_next/static/xg2hrnmcj/pages/404.js",
        revision: "3ff57bbc98d1feb38f3d148fe698d696"
    }, {
        url: "_next/static/xg2hrnmcj/pages/500.js",
        revision: "8d21ff947ec59a04ed9605262498dba1"
    }, {
        url: "_next/static/xg2hrnmcj/pages/MacBookStep.js",
        revision: "39c7f57fc96df832299a169d23b562ad"
    }, {
        url: "_next/static/xg2hrnmcj/pages/[slug].js",
        revision: "85fe8f3ba61710cdfa0968818058535d"
    }, {
        url: "_next/static/xg2hrnmcj/pages/_app.js",
        revision: "f5359e15d6e8a4a86a57380662e99dae"
    }, {
        url: "_next/static/xg2hrnmcj/pages/_error.js",
        revision: "ac02b8fb4b8905b007b3e14e09818885"
    }, {
        url: "_next/static/xg2hrnmcj/pages/acrylic-photo-blocks.js",
        revision: "50e58f3722f99487f603f8c0af51cd14"
    }, {
        url: "_next/static/xg2hrnmcj/pages/acrylic-prints.js",
        revision: "6ba9ca7001216a92a38756011b00442a"
    }, {
        url: "_next/static/xg2hrnmcj/pages/anniversary-gifts.js",
        revision: "6c315974117fed662752d1fb122000a6"
    }, {
        url: "_next/static/xg2hrnmcj/pages/birthday-gifts.js",
        revision: "e1cd458a05500f96d6299f30d3f4e62e"
    }, {
        url: "_next/static/xg2hrnmcj/pages/blog/blog.js",
        revision: "bdb4950d7b3890d2d0cc2ee022b83473"
    }, {
        url: "_next/static/xg2hrnmcj/pages/blog/blogDetail.js",
        revision: "1330a9f4d28d00ed5cec92b692512f57"
    }, {
        url: "_next/static/xg2hrnmcj/pages/blog/blogshare.js",
        revision: "05a907c58337fee65ba7bbbb25dd6c40"
    }, {
        url: "_next/static/xg2hrnmcj/pages/bookmarks/bookmarks.js",
        revision: "2f2ac774b16565cb9d9d4ed5792346af"
    }, {
        url: "_next/static/xg2hrnmcj/pages/bus-rolls.js",
        revision: "3722dc304e2585916a53462de092dedc"
    }, {
        url: "_next/static/xg2hrnmcj/pages/canvas-banners.js",
        revision: "f083022f09ece9f15c69eda9facba43a"
    }, {
        url: "_next/static/xg2hrnmcj/pages/canvas-prints.js",
        revision: "591ad9247d7c62036bd702cd7860bc8a"
    }, {
        url: "_next/static/xg2hrnmcj/pages/canvas-wall-displays.js",
        revision: "3178573543c8c5d2e021f98d9d4b6612"
    }, {
        url: "_next/static/xg2hrnmcj/pages/cart/ToolTip.js",
        revision: "2f779485458740920a4e56f3e3c70ec0"
    }, {
        url: "_next/static/xg2hrnmcj/pages/cart/abandoned.js",
        revision: "c1d7b45bc38dee3e01fe90d492ae2065"
    }, {
        url: "_next/static/xg2hrnmcj/pages/cart/cart.js",
        revision: "f95ae4f1e87d99e6698bc74cb1d5c8d5"
    }, {
        url: "_next/static/xg2hrnmcj/pages/cart/validateauthcode.js",
        revision: "9410bd4092c3c2848f78e8c82a6ccf8d"
    }, {
        url: "_next/static/xg2hrnmcj/pages/catalogsearch/result.js",
        revision: "a06d5868d9a56d04444d4980fc007216"
    }, {
        url: "_next/static/xg2hrnmcj/pages/checkout/artwork-proof.js",
        revision: "b0ef99638eeba352d91b0bbc6e8faf26"
    }, {
        url: "_next/static/xg2hrnmcj/pages/checkout/artwork.js",
        revision: "42bb00f99abd6dd5fcd28240da2551d2"
    }, {
        url: "_next/static/xg2hrnmcj/pages/checkout/ccavenuepayment.js",
        revision: "7cc9678a17ed3bcb36aa785fe2076b42"
    }, {
        url: "_next/static/xg2hrnmcj/pages/checkout/checkout.js",
        revision: "f47ac0c1b40d3127725311cbfd24d272"
    }, {
        url: "_next/static/xg2hrnmcj/pages/checkout/orderproof.js",
        revision: "dd589a448eef912d0f79d7791aa88e9c"
    }, {
        url: "_next/static/xg2hrnmcj/pages/checkout/success.js",
        revision: "a6bb6869553ff22bd75c20b7eebc9d9f"
    }, {
        url: "_next/static/xg2hrnmcj/pages/christmas-gifts.js",
        revision: "821ef1a45db66095e544b6333a10a12e"
    }, {
        url: "_next/static/xg2hrnmcj/pages/coasters.js",
        revision: "9ef055a81c775522bafa68549703a2e9"
    }, {
        url: "_next/static/xg2hrnmcj/pages/collage-gifts.js",
        revision: "f6e2cccd7ab5a37124bdcd181f095f81"
    }, {
        url: "_next/static/xg2hrnmcj/pages/contact-us.js",
        revision: "4d8f9c1421886064ed233bd5668b4947"
    }, {
        url: "_next/static/xg2hrnmcj/pages/corona-keychain/corona-keychain.js",
        revision: "a0bb9b83f981e53ce92afbe56308fc2a"
    }, {
        url: "_next/static/xg2hrnmcj/pages/corporate-gifts.js",
        revision: "c29de84ebb34f6c83d271012d5987438"
    }, {
        url: "_next/static/xg2hrnmcj/pages/coupon-partners.js",
        revision: "b6bb3e74cd7062df8d81b0e90f7f05d8"
    }, {
        url: "_next/static/xg2hrnmcj/pages/createaccount/createaccount.js",
        revision: "d71cb482efa35c41656fc6b59cfa3400"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-3d-crystal-cube.js",
        revision: "a0b2d79ac8527e9e6e1b5b13bf21b5b2"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-apron.js",
        revision: "8e9cfb33fa363c630f963e341cf4ab44"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-caricature-photo-stand.js",
        revision: "7c50ad1d6c21c00ade15b1fe95ff23d1"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-caricature.js",
        revision: "231ca0815c88b648ee47ef0800ed7453"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-chopping-board.js",
        revision: "e4080e32679f7a6e391e63c8192a649e"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-diary/custom-diary.js",
        revision: "46e18030e4ca3e605901477c8b5e7774"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-love-music-plaques.js",
        revision: "8500903475e147ab6eac2f333236c2b0"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-luggage-tags/custom-luggage-tags.js",
        revision: "5748bd12c3ba735e2670b01aa8ffdeac"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-moon-lamps.js",
        revision: "d62ab5194d839987e3f23a29440561f4"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-mouse-pads.js",
        revision: "b701c1a2a1e8748cca3a683b112ed596"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-pen-drives.js",
        revision: "10907a05d125a46efbe58651c21bfa01"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-pet-shaped-pillow/custom-pet-shaped-pillow.js",
        revision: "0fa2573cb1bbff00634f2b0ae77518c2"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-photo-socks/custom-photo-socks.js",
        revision: "4ed2e5656e87b98d39c964488282b271"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-photo-umbrella.js",
        revision: "14c1e9375be0cacfc355489449979c63"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-power-bank.js",
        revision: "8a0568ac00866fb3928218d53b33fc66"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-printed-yoga-mats.js",
        revision: "6c9df120fc3a140eb1e2d5dc3d73f9b6"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-sequin-pillow/custom-sequin-pillow.js",
        revision: "2847976f9c88c84b598a8ddc8fe81007"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-song-lyrics-on-canvas.js",
        revision: "a8976717b1fde319e56d3d5e5f5ff333"
    }, {
        url: "_next/static/xg2hrnmcj/pages/custom-table-mats.js",
        revision: "852e1bf3ac7b6400da54f701473252bb"
    }, {
        url: "_next/static/xg2hrnmcj/pages/design/tool.js",
        revision: "486039440bbb80aa5d7cd8158600dd22"
    }, {
        url: "_next/static/xg2hrnmcj/pages/desk-calendar.js",
        revision: "8118c627c3b50e4c0a1280a7a737a07f"
    }, {
        url: "_next/static/xg2hrnmcj/pages/didactic-game/didactic-game.js",
        revision: "0a07c28599db749813939f1b1364c3b2"
    }, {
        url: "_next/static/xg2hrnmcj/pages/diwali-gifts.js",
        revision: "805eaca65213a2fff8f55442dac21e78"
    }, {
        url: "_next/static/xg2hrnmcj/pages/double-layer-acrylic-frames.js",
        revision: "502ea330f9d49bd49dcc8504e4500edd"
    }, {
        url: "_next/static/xg2hrnmcj/pages/fathers-day-gifts.js",
        revision: "9845b4441b4f02dd534b82345e9a1a1f"
    }, {
        url: "_next/static/xg2hrnmcj/pages/forgotpassword/forgotpassword.js",
        revision: "d9751d71ae06330420e70f413396d2a3"
    }, {
        url: "_next/static/xg2hrnmcj/pages/framed-prints.js",
        revision: "99e89258f2594772f2abf5e31e9987b0"
    }, {
        url: "_next/static/xg2hrnmcj/pages/friendship-day-gifts.js",
        revision: "67141f3587fe7b2297423cb7763284a7"
    }, {
        url: "_next/static/xg2hrnmcj/pages/giftcertificate/giftcertificate.js",
        revision: "5b30554850ad36da0883b9b434a3bb25"
    }, {
        url: "_next/static/xg2hrnmcj/pages/giftcertificate/updateGiftCertificate.js",
        revision: "043d5640e90b04e60eccbd439822985b"
    }, {
        url: "_next/static/xg2hrnmcj/pages/heart-shaped-moon-lamp/heart-shaped-moon-lamp.js",
        revision: "f1a3a53331b55a940a173ddc261042a8"
    }, {
        url: "_next/static/xg2hrnmcj/pages/hexagon-canvas.js",
        revision: "9a766837a3a639652b67692ea2a456be"
    }, {
        url: "_next/static/xg2hrnmcj/pages/index.js",
        revision: "9ef39c9ac35ce81f2d2f82a26545764f"
    }, {
        url: "_next/static/xg2hrnmcj/pages/inspiration-gallery/inspiration-gallery.js",
        revision: "188e23ae9661d4ea284a63468385f187"
    }, {
        url: "_next/static/xg2hrnmcj/pages/interior-home-decoration.js",
        revision: "93418688a47fe148702b6a161f4f598e"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/2-panel-canvas-wall-art/2-panel-canvas-wall-art.js",
        revision: "83c671aed2a211fc16f665d0bf860c57"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/accessories/accessories.js",
        revision: "86cc96204e17304d5eb8cc772aeff7a3"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/affiliate/affiliate.js",
        revision: "d348fc3465ff51c877140b95cf6a5ca9"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/andy-warhol-canvas/andy-warhol-canvas.js",
        revision: "e0b2359e846ad993ae477d30e7fb18c7"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/blank-canvas-panels-boards/blank-canvas-panels-boards.js",
        revision: "1a8738bb507494e864461131b277bdce"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/blank-stretched-canvas/blank-stretched-canvas.js",
        revision: "7e3bce1c448e945072291ef8d143aef6"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/brandbassador/brandbassador.js",
        revision: "5bb93a5748f38ce7007d75bf134335b8"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/buy-now-create-later/buy-now-create-later.js",
        revision: "23f760e02f220e20e7b60e06a7db0760"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/canvas-edges/canvas-edges.js",
        revision: "839305289c0c84f31ee14df29c77b390"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/canvas-floater-frames/canvas-floater-frames.js",
        revision: "fddbe6dfbb9da75d473947605ff38e63"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/canvas-pads/canvas-pads.js",
        revision: "63e242322e3fd44f14873324ddaae275"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/canvas-photo-retouching/canvas-photo-retouching.js",
        revision: "0dba28807f66551b98be7d6fe7a722c9"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/corporate-art/corporate-art.js",
        revision: "fd197ae90b8188b1555b6b0af023e57d"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/coupons-deals/coupons-deals.js",
        revision: "65bc453a9d28277c39be7aecfc6bd838"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/custom-flip-flops/custom-flip-flops.js",
        revision: "89813c94cdb27b11bbe9d3bc252abd74"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/custom-woven-blankets/ProductGridCustomWownBlankets.js",
        revision: "0db2d4fbf964f6e2954bdabde37c5f63"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/custom-woven-blankets/custom-woven-blankets.js",
        revision: "ef742e1ff938301cca3ebef9fc62ff4b"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/customer-reviews/customer-reviews.js",
        revision: "5076ef54b0b39a65dd50d5afa1835f0c"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/customer-showcase/customer-showcase.js",
        revision: "9e8dd5e7e5a8149269e99876c7ba864f"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/digital-oil-painting/digital-oil-painting.js",
        revision: "d34e5388adff0ad227a379e81e647400"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/easel-stands/easel-stands.js",
        revision: "692bad9e0c1ddb2ab3ffbfc1e51e4ac1"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/easel-stands/order-es.js",
        revision: "d9dcaf867592ce00ae8f417c9e13dcc4"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/emoji-prints/emoji-prints.js",
        revision: "65b47afe43653906a7b6ba817ed1fbfe"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/engraved-photos/engraved-photos.js",
        revision: "b3e643925eba36cb51a38675ef0a1185"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/facebook-canvas-photo-prints/facebook-canvas-photo-prints.js",
        revision: "40213f8ed7bbeb48bd2dd3c99149f1e0"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/facebook-offer/facebook-offer.js",
        revision: "92a45dccf3dd69f06964fa996ec18b48"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/famous-artist/famous-artist.js",
        revision: "f224455820b1175df8b979fbec953aa0"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/filter-and-effects/filter-and-effects.js",
        revision: "8c897450d9106d7e89598a415e6e0d1e"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/framed-canvas/framed-canvas.js",
        revision: "22dd4e45be62bc03c26dc240c6aefcb0"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/frames/frames.js",
        revision: "7e855a6c337b1c7ca4a5d87d07307c99"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/free-canvas-prints/free-canvas-prints.js",
        revision: "4476c06c88fab4b290a71f4c235962a5"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/free-canvas/free-canvas.js",
        revision: "b18503871163e1dbce2eb1c6ddf10dc0"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/free-photo-canvas/free-photo-canvas.js",
        revision: "1736b2f1167f5777e0bf524b5c3ef233"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/free-photoengraved/free-photoengraved.js",
        revision: "577da8ff020ee4b5ce0ad48255282adf"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/free-pillow/free-pillow.js",
        revision: "ff97d2e1dd71667e73b33ae9befe8f71"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/gallery-wrapped-canvas/gallery-wrapped-canvas.js",
        revision: "da60d4d5f83bdd3aa9523672ae155f9a"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/giclee-canvas-printing/giclee-canvas-printing.js",
        revision: "b2486a6ef317044f714495fbe3dc2b0e"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/giving-programs/giving-programs.js",
        revision: "af9d9eaaa2018f175e360c56147050eb"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/groupondeals/groupondeals.js",
        revision: "332df1cf531d1ec0173c209897e821a7"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/hanging-canvas/hanging-canvas.js",
        revision: "2a93fff8e62f3424abd76fdfbfa1db77"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/id-me/id-me.js",
        revision: "b5ef03e7f60967776083a7bc85f6e55c"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/insta-promotion/insta-promotion.js",
        revision: "580d41a36b6379ec6814a458163e82f7"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/instagram-canvas-photo-prints/instagram-canvas-photo-prints.js",
        revision: "7f3d74546003088fcf7ae6e7a34e3c69"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/magic-mugs/magic-mugs.js",
        revision: "7801c7c6d17a5d927e9e8ab6b5a7cf98"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/mini-canvas-prints/mini-canvas-prints.js",
        revision: "979c2a64abb0f0b1a26df581fdd273ce"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/new-york-canvas-prints/new-york-canvas-prints.js",
        revision: "14d0011f415036bfde27c584fcafde87"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/order-api/order-api.js",
        revision: "5a5ed2131f6994f3d49621dc679a64c9"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/personalized-fathers-day-gifts/personalized-fathers-day-gifts.js",
        revision: "84d7a40406fbb0541f5933583f7f10b3"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/photo-blankets/photo-blankets.js",
        revision: "e2448910a39f6af20cf52b977680ffe1"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/photo-boards/photo-boards.js",
        revision: "02794a6d0592b25fdaa647926c0c809b"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/photo-calendars/MacBookStep.js",
        revision: "361ee235a037a3ca9fc2604ead7cd525"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/photo-calendars/photo-calendars.js",
        revision: "04af56879723e32f855e9af3b071660c"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/photo-enlargements/photo-enlargements.js",
        revision: "33670a3b428c03c95038c965f16dfa25"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/photo-gifts/photo-gifts.js",
        revision: "1f5da26d2e9502e419c611e5188dcfbf"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/photo-ornaments/photo-ornaments.js",
        revision: "e326a99510dda7bd4e36f150d0d443ed"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/photographers/photographers.js",
        revision: "859c03a758a87575d41d193aad5b8a30"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/photos-on-canvas/photos-on-canvas.js",
        revision: "985a9c906f5d2ab8025c8dd8a35da3d2"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/prisma-photo-prints/prisma-photo-prints.js",
        revision: "69e686355c572243c6e7d8d3be057c60"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/quality-canvas-printing/quality-canvas-printing.js",
        revision: "f1c0d3bbc1b3b80946bd08aac976bdea"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/quoteoncanvas/quote-on-canvas.js",
        revision: "71ce1c98dee2297379a76235268b581e"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/reward-program/reward-program.js",
        revision: "e794c2c45cb1d4230e6a81fc10f8411a"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/rolled-canvas/rolled-canvas.js",
        revision: "770f2e3be59cbdf8e0cb1abfc81867b0"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/share-photo/share-photo.js",
        revision: "17790f95fe622c97b40206a0de206717"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/stretcher-bars/commonStretcherBars.js",
        revision: "9a53d2abd5bd13e0836084c2ccfe0186"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/stretcher-bars/standard-stretcher-bars.js",
        revision: "1ed938a802acbb419475d5aeb5e5b760"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/stretcher-bars/stretcher-bars.js",
        revision: "5535e1605349dc50c916de612c4505cb"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/table-top/table-top.js",
        revision: "115814cfca8f40f9d6e7b9fd574c45ba"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/triptych-prints/triptych-prints.js",
        revision: "bed23b56890976993b062a0e5d8e50e8"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/wall-decals/wall-decals.js",
        revision: "744158532cb69beef7ff26e6c016cd47"
    }, {
        url: "_next/static/xg2hrnmcj/pages/landing/what-canvas-print/what-is-a-canvas-print.js",
        revision: "2573162d47a14fd9048f8604390908a6"
    }, {
        url: "_next/static/xg2hrnmcj/pages/large-canvas-prints.js",
        revision: "e48cfa115853a2862b85b744609fcf34"
    }, {
        url: "_next/static/xg2hrnmcj/pages/large-metal-prints.js",
        revision: "17441ebaa430eb259b8808528755d23c"
    }, {
        url: "_next/static/xg2hrnmcj/pages/led-custom-lamp/led-custom-lamp.js",
        revision: "fe132cbb86dfa03edb2cc5f2dbb4fa5f"
    }, {
        url: "_next/static/xg2hrnmcj/pages/login/login.js",
        revision: "5ad830110e12648ef0bcf1672957ea12"
    }, {
        url: "_next/static/xg2hrnmcj/pages/magic-mugs.js",
        revision: "05ce8c847b38eb16f4588c226b21e212"
    }, {
        url: "_next/static/xg2hrnmcj/pages/metal-prints.js",
        revision: "3ef1ef65a1da1ca3ab5547f87eabafd7"
    }, {
        url: "_next/static/xg2hrnmcj/pages/mothers-day-gifts.js",
        revision: "3f35d422c180e951e94b98880a784b3f"
    }, {
        url: "_next/static/xg2hrnmcj/pages/myaccount/myaccount.js",
        revision: "30acd071c092c3ced84fccae33e948e7"
    }, {
        url: "_next/static/xg2hrnmcj/pages/new-year-sale-2022.js",
        revision: "341364ed4e735028987c1ccc0a33e99d"
    }, {
        url: "_next/static/xg2hrnmcj/pages/order/bulkorder.js",
        revision: "3c484ebdab5f20555323dfcf7a5a967a"
    }, {
        url: "_next/static/xg2hrnmcj/pages/panoramic-canvas-photo-prints.js",
        revision: "bc09a0f5ef98809c5e9a867dac6b004a"
    }, {
        url: "_next/static/xg2hrnmcj/pages/parents-day-gifts.js",
        revision: "888f3ad7ea99aaf84a21d567ce57053c"
    }, {
        url: "_next/static/xg2hrnmcj/pages/personalised-mobile-stand.js",
        revision: "33fe91db6f53865d9f5a008c195946cc"
    }, {
        url: "_next/static/xg2hrnmcj/pages/personalised-photo-rakhi.js",
        revision: "d616289a3509e57212532316e3b29e67"
    }, {
        url: "_next/static/xg2hrnmcj/pages/personalised-pillow-cases.js",
        revision: "3db4c5e99aa502a46c4317867c7a34dc"
    }, {
        url: "_next/static/xg2hrnmcj/pages/personalised-tote-bags.js",
        revision: "badebf77281b6ebc4aa4423470609dab"
    }, {
        url: "_next/static/xg2hrnmcj/pages/personalised-wall-mural.js",
        revision: "0ef20294f034ae4e40eac185dd668a77"
    }, {
        url: "_next/static/xg2hrnmcj/pages/personalized-fathers-day-gift-ideas.js",
        revision: "a2326233b578d6412b01aa64b309ab67"
    }, {
        url: "_next/static/xg2hrnmcj/pages/personalized-photo-gifts.js",
        revision: "310aeea1cd1c08425f62d82c0bce3edb"
    }, {
        url: "_next/static/xg2hrnmcj/pages/photo-books.js",
        revision: "34a50ea9a772336b8168eebb2d97b582"
    }, {
        url: "_next/static/xg2hrnmcj/pages/photo-calendars.js",
        revision: "53ea7c2aca206c451f26ee74ba5e8095"
    }, {
        url: "_next/static/xg2hrnmcj/pages/photo-collage.js",
        revision: "2dcb2d64ab015b2e4042d17540a7ff72"
    }, {
        url: "_next/static/xg2hrnmcj/pages/photo-gallery/photo-galleries-view.js",
        revision: "b88c14b4640816a02afe822661dd81b8"
    }, {
        url: "_next/static/xg2hrnmcj/pages/photo-gallery/photo-gallery.js",
        revision: "b5d9022b44e2f25a7aad4ff2c6d47fa2"
    }, {
        url: "_next/static/xg2hrnmcj/pages/photo-magnets.js",
        revision: "b283aaa3c4dbd129e7762558776fd0e0"
    }, {
        url: "_next/static/xg2hrnmcj/pages/photo-mosaic-on-canvas.js",
        revision: "ba7b4fbf03ee3b6bf99eac800c01a861"
    }, {
        url: "_next/static/xg2hrnmcj/pages/photo-mugs.js",
        revision: "a69ac45c7edbfaadf7370eb55944252d"
    }, {
        url: "_next/static/xg2hrnmcj/pages/photo-pillows.js",
        revision: "aedb0eea0880f7cb6d233afa0f1ef0fa"
    }, {
        url: "_next/static/xg2hrnmcj/pages/photo-prints.js",
        revision: "d86088dbb4a1607e0ff8934ff3639410"
    }, {
        url: "_next/static/xg2hrnmcj/pages/photo-puzzles.js",
        revision: "cd976ba0161bf3d8c6e361a1b3d318a0"
    }, {
        url: "_next/static/xg2hrnmcj/pages/playing-cards/playing-cards.js",
        revision: "37f98653fea968786c868ade6f62810d"
    }, {
        url: "_next/static/xg2hrnmcj/pages/pop-art-on-canvas.js",
        revision: "257ff2e2e65c039258817cb9278df27a"
    }, {
        url: "_next/static/xg2hrnmcj/pages/poster-calendar.js",
        revision: "1e4857c565c9060a8398453fd9e4d2ae"
    }, {
        url: "_next/static/xg2hrnmcj/pages/poster-prints.js",
        revision: "b8e645d7c949110223f5b50842ce9dcf"
    }, {
        url: "_next/static/xg2hrnmcj/pages/productquestionanswer/productqa.js",
        revision: "c50c74c6a067044124230c8013a430cc"
    }, {
        url: "_next/static/xg2hrnmcj/pages/promotional/InfoCanvasPrint.js",
        revision: "3243d674eb1ea1b1312b30a1f8d141dd"
    }, {
        url: "_next/static/xg2hrnmcj/pages/promotional/promotional.js",
        revision: "de6acf45ea5384a62380d7065e5240e3"
    }, {
        url: "_next/static/xg2hrnmcj/pages/promotional/promotionalframedprints.js",
        revision: "85d1f38e828cbfc2db8032474d8d6b2d"
    }, {
        url: "_next/static/xg2hrnmcj/pages/ready-to-hang.js",
        revision: "96acc6be3d990e901cf26ddf05d782f4"
    }, {
        url: "_next/static/xg2hrnmcj/pages/refer-a-friend.js",
        revision: "8c77908a41b342d9767b1b904ccb04ba"
    }, {
        url: "_next/static/xg2hrnmcj/pages/resetpassword/resetpassword.js",
        revision: "980f83bac22b43f198de5a4210f051c2"
    }, {
        url: "_next/static/xg2hrnmcj/pages/rubikcube/rubikcube.js",
        revision: "bf0fd0f541123558b0381ea3e4917de6"
    }, {
        url: "_next/static/xg2hrnmcj/pages/share/facebook.js",
        revision: "fefeaff0ac84958df1a5ddbc5255de81"
    }, {
        url: "_next/static/xg2hrnmcj/pages/share/twitter.js",
        revision: "e9c5de402fcf01c0b55ad05ddc9a8aba"
    }, {
        url: "_next/static/xg2hrnmcj/pages/shipping/shipping.js",
        revision: "d3c809106198fa4b202996ecd104764f"
    }, {
        url: "_next/static/xg2hrnmcj/pages/sizes-prices.js",
        revision: "635cfa1e309770f03d8cecb6883afc2f"
    }, {
        url: "_next/static/xg2hrnmcj/pages/sneeze-guard/sneeze-guard.js",
        revision: "e75468f12f5d9285d26c0e827ae7128d"
    }, {
        url: "_next/static/xg2hrnmcj/pages/sot/sotfeed.js",
        revision: "91a53b9ae6187d099746737d4681afad"
    }, {
        url: "_next/static/xg2hrnmcj/pages/split-canvas-prints.js",
        revision: "b23b8d0fc1c1e02c468331cd5efdda9c"
    }, {
        url: "_next/static/xg2hrnmcj/pages/static/page.js",
        revision: "26f7fbf6251117d311fe215931f2fed9"
    }, {
        url: "_next/static/xg2hrnmcj/pages/valentine-day-gifts.js",
        revision: "c7f31405bbc84cece7f0d68139f816d6"
    }, {
        url: "_next/static/xg2hrnmcj/pages/wall-calendar.js",
        revision: "90c5d48aaad2ed876e1e6ae1a2b6a19e"
    }, {
        url: "_next/static/xg2hrnmcj/pages/wedding-gifts.js",
        revision: "7c2f9cfc90cd0228cbef2d339aeca4fd"
    }, {
        url: "_next/static/xg2hrnmcj/pages/wholesale-photo-printing.js",
        revision: "24ed129927b37b39ec4b9ced06d00693"
    }, {
        url: "_next/static/xg2hrnmcj/pages/wood-prints.js",
        revision: "e7d8ecc0182eaadd937d7f75b62ae5d5"
    }]), D(W), g(/\.cloudfront\.net\/static\/fonts\/.*$/, new class {
        constructor(s = {}) {
            this.p = l(s.cacheName), this.S = s.plugins || [], this.K = s.fetchOptions, this.A = s.matchOptions
        }
        async handle({
            event: s,
            request: c
        }) {
            "string" == typeof c && (c = new Request(c));
            let a, t = await U({
                cacheName: this.p,
                request: c,
                event: s,
                matchOptions: this.A,
                plugins: this.S
            });
            if (!t) try {
                t = await this.C(c, s)
            } catch (s) {
                a = s
            }
            if (!t) throw new e("no-response", {
                url: c.url,
                error: a
            });
            return t
        }
        async C(s, e) {
            const c = await E({
                    request: s,
                    event: e,
                    fetchOptions: this.K,
                    plugins: this.S
                }),
                a = c.clone(),
                t = R({
                    cacheName: this.p,
                    request: s,
                    response: a,
                    event: e,
                    plugins: this.S
                });
            if (e) try {
                e.waitUntil(t)
            } catch (s) {}
            return c
        }
    }({
        cacheName: "custom-fonts",
        plugins: [new k({
            maxEntries: 4,
            maxAgeSeconds: 86400,
            purgeOnQuotaError: !0
        })]
    }), "GET"), g(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i, new N({
        cacheName: "static-font-assets",
        plugins: [new k({
            maxEntries: 20,
            maxAgeSeconds: 604800,
            purgeOnQuotaError: !0
        })]
    }), "GET"), g(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i, new N({
        cacheName: "static-image-assets",
        plugins: [new k({
            maxEntries: 100,
            maxAgeSeconds: 86400,
            purgeOnQuotaError: !0
        })]
    }), "GET"), g(/\.(?:js)$/i, new N({
        cacheName: "static-js-assets",
        plugins: [new k({
            maxEntries: 50,
            maxAgeSeconds: 86400,
            purgeOnQuotaError: !0
        })]
    }), "GET"), g(/\.(?:css|less)$/i, new N({
        cacheName: "static-style-assets",
        plugins: [new k({
            maxEntries: 50,
            maxAgeSeconds: 86400,
            purgeOnQuotaError: !0
        })]
    }), "GET"), g(/\.(?:json)$/i, new N({
        cacheName: "static-data-assets",
        plugins: [new k({
            maxEntries: 50,
            maxAgeSeconds: 86400,
            purgeOnQuotaError: !0
        })]
    }), "GET");