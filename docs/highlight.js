/*
  Highlight.js 10.2.0 (da7d149b)
  License: BSD-3-Clause
  Copyright (c) 2006-2020, Ivan Sagalaev
*/
var hljs = (function () {
    'use strict'
    function e(n) {
        Object.freeze(n)
        var t = 'function' == typeof n
        return (
            Object.getOwnPropertyNames(n).forEach(function (r) {
                !Object.hasOwnProperty.call(n, r) ||
                    null === n[r] ||
                    ('object' != typeof n[r] && 'function' != typeof n[r]) ||
                    (t &&
                        ('caller' === r ||
                            'callee' === r ||
                            'arguments' === r)) ||
                    Object.isFrozen(n[r]) ||
                    e(n[r])
            }),
            n
        )
    }
    class n {
        constructor(e) {
            void 0 === e.data && (e.data = {}), (this.data = e.data)
        }
        ignoreMatch() {
            this.ignore = !0
        }
    }
    function t(e) {
        return e
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
    }
    function r(e, ...n) {
        var t = {}
        for (const n in e) t[n] = e[n]
        return (
            n.forEach(function (e) {
                for (const n in e) t[n] = e[n]
            }),
            t
        )
    }
    function a(e) {
        return e.nodeName.toLowerCase()
    }
    var i = Object.freeze({
        __proto__: null,
        escapeHTML: t,
        inherit: r,
        nodeStream: function (e) {
            var n = []
            return (
                (function e(t, r) {
                    for (var i = t.firstChild; i; i = i.nextSibling)
                        3 === i.nodeType
                            ? (r += i.nodeValue.length)
                            : 1 === i.nodeType &&
                              (n.push({ event: 'start', offset: r, node: i }),
                              (r = e(i, r)),
                              a(i).match(/br|hr|img|input/) ||
                                  n.push({ event: 'stop', offset: r, node: i }))
                    return r
                })(e, 0),
                n
            )
        },
        mergeStreams: function (e, n, r) {
            var i = 0,
                s = '',
                o = []
            function l() {
                return e.length && n.length
                    ? e[0].offset !== n[0].offset
                        ? e[0].offset < n[0].offset
                            ? e
                            : n
                        : 'start' === n[0].event
                        ? e
                        : n
                    : e.length
                    ? e
                    : n
            }
            function c(e) {
                s +=
                    '<' +
                    a(e) +
                    [].map
                        .call(e.attributes, function (e) {
                            return ' ' + e.nodeName + '="' + t(e.value) + '"'
                        })
                        .join('') +
                    '>'
            }
            function u(e) {
                s += '</' + a(e) + '>'
            }
            function g(e) {
                ;('start' === e.event ? c : u)(e.node)
            }
            for (; e.length || n.length; ) {
                var d = l()
                if (
                    ((s += t(r.substring(i, d[0].offset))),
                    (i = d[0].offset),
                    d === e)
                ) {
                    o.reverse().forEach(u)
                    do {
                        g(d.splice(0, 1)[0]), (d = l())
                    } while (d === e && d.length && d[0].offset === i)
                    o.reverse().forEach(c)
                } else
                    'start' === d[0].event ? o.push(d[0].node) : o.pop(),
                        g(d.splice(0, 1)[0])
            }
            return s + t(r.substr(i))
        }
    })
    const s = '</span>',
        o = (e) => !!e.kind
    class l {
        constructor(e, n) {
            ;(this.buffer = ''),
                (this.classPrefix = n.classPrefix),
                e.walk(this)
        }
        addText(e) {
            this.buffer += t(e)
        }
        openNode(e) {
            if (!o(e)) return
            let n = e.kind
            e.sublanguage || (n = `${this.classPrefix}${n}`), this.span(n)
        }
        closeNode(e) {
            o(e) && (this.buffer += s)
        }
        value() {
            return this.buffer
        }
        span(e) {
            this.buffer += `<span class="${e}">`
        }
    }
    class c {
        constructor() {
            ;(this.rootNode = { children: [] }), (this.stack = [this.rootNode])
        }
        get top() {
            return this.stack[this.stack.length - 1]
        }
        get root() {
            return this.rootNode
        }
        add(e) {
            this.top.children.push(e)
        }
        openNode(e) {
            const n = { kind: e, children: [] }
            this.add(n), this.stack.push(n)
        }
        closeNode() {
            if (this.stack.length > 1) return this.stack.pop()
        }
        closeAllNodes() {
            for (; this.closeNode(); );
        }
        toJSON() {
            return JSON.stringify(this.rootNode, null, 4)
        }
        walk(e) {
            return this.constructor._walk(e, this.rootNode)
        }
        static _walk(e, n) {
            return (
                'string' == typeof n
                    ? e.addText(n)
                    : n.children &&
                      (e.openNode(n),
                      n.children.forEach((n) => this._walk(e, n)),
                      e.closeNode(n)),
                e
            )
        }
        static _collapse(e) {
            'string' != typeof e &&
                e.children &&
                (e.children.every((e) => 'string' == typeof e)
                    ? (e.children = [e.children.join('')])
                    : e.children.forEach((e) => {
                          c._collapse(e)
                      }))
        }
    }
    class u extends c {
        constructor(e) {
            super(), (this.options = e)
        }
        addKeyword(e, n) {
            '' !== e && (this.openNode(n), this.addText(e), this.closeNode())
        }
        addText(e) {
            '' !== e && this.add(e)
        }
        addSublanguage(e, n) {
            const t = e.root
            ;(t.kind = n), (t.sublanguage = !0), this.add(t)
        }
        toHTML() {
            return new l(this, this.options).value()
        }
        finalize() {
            return !0
        }
    }
    function g(e) {
        return e ? ('string' == typeof e ? e : e.source) : null
    }
    const d =
            '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)',
        h = { begin: '\\\\[\\s\\S]', relevance: 0 },
        f = {
            className: 'string',
            begin: "'",
            end: "'",
            illegal: '\\n',
            contains: [h]
        },
        p = {
            className: 'string',
            begin: '"',
            end: '"',
            illegal: '\\n',
            contains: [h]
        },
        m = {
            begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
        },
        b = function (e, n, t = {}) {
            var a = r(
                { className: 'comment', begin: e, end: n, contains: [] },
                t
            )
            return (
                a.contains.push(m),
                a.contains.push({
                    className: 'doctag',
                    begin: '(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):',
                    relevance: 0
                }),
                a
            )
        },
        v = b('//', '$'),
        x = b('/\\*', '\\*/'),
        E = b('#', '$')
    var _ = Object.freeze({
            __proto__: null,
            IDENT_RE: '[a-zA-Z]\\w*',
            UNDERSCORE_IDENT_RE: '[a-zA-Z_]\\w*',
            NUMBER_RE: '\\b\\d+(\\.\\d+)?',
            C_NUMBER_RE: d,
            BINARY_NUMBER_RE: '\\b(0b[01]+)',
            RE_STARTERS_RE:
                '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~',
            SHEBANG: (e = {}) => {
                const n = /^#![ ]*\//
                return (
                    e.binary &&
                        (e.begin = (function (...e) {
                            return e.map((e) => g(e)).join('')
                        })(n, /.*\b/, e.binary, /\b.*/)),
                    r(
                        {
                            className: 'meta',
                            begin: n,
                            end: /$/,
                            relevance: 0,
                            'on:begin': (e, n) => {
                                0 !== e.index && n.ignoreMatch()
                            }
                        },
                        e
                    )
                )
            },
            BACKSLASH_ESCAPE: h,
            APOS_STRING_MODE: f,
            QUOTE_STRING_MODE: p,
            PHRASAL_WORDS_MODE: m,
            COMMENT: b,
            C_LINE_COMMENT_MODE: v,
            C_BLOCK_COMMENT_MODE: x,
            HASH_COMMENT_MODE: E,
            NUMBER_MODE: {
                className: 'number',
                begin: '\\b\\d+(\\.\\d+)?',
                relevance: 0
            },
            C_NUMBER_MODE: { className: 'number', begin: d, relevance: 0 },
            BINARY_NUMBER_MODE: {
                className: 'number',
                begin: '\\b(0b[01]+)',
                relevance: 0
            },
            CSS_NUMBER_MODE: {
                className: 'number',
                begin: '\\b\\d+(\\.\\d+)?(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?',
                relevance: 0
            },
            REGEXP_MODE: {
                begin: /(?=\/[^/\n]*\/)/,
                contains: [
                    {
                        className: 'regexp',
                        begin: /\//,
                        end: /\/[gimuy]*/,
                        illegal: /\n/,
                        contains: [
                            h,
                            {
                                begin: /\[/,
                                end: /\]/,
                                relevance: 0,
                                contains: [h]
                            }
                        ]
                    }
                ]
            },
            TITLE_MODE: {
                className: 'title',
                begin: '[a-zA-Z]\\w*',
                relevance: 0
            },
            UNDERSCORE_TITLE_MODE: {
                className: 'title',
                begin: '[a-zA-Z_]\\w*',
                relevance: 0
            },
            METHOD_GUARD: { begin: '\\.\\s*[a-zA-Z_]\\w*', relevance: 0 },
            END_SAME_AS_BEGIN: function (e) {
                return Object.assign(e, {
                    'on:begin': (e, n) => {
                        n.data._beginMatch = e[1]
                    },
                    'on:end': (e, n) => {
                        n.data._beginMatch !== e[1] && n.ignoreMatch()
                    }
                })
            }
        }),
        w = 'of and for in not or if then'.split(' ')
    function N(e, n) {
        return n
            ? +n
            : (function (e) {
                  return w.includes(e.toLowerCase())
              })(e)
            ? 0
            : 1
    }
    const y = {
            props: ['language', 'code', 'autodetect'],
            data: function () {
                return { detectedLanguage: '', unknownLanguage: !1 }
            },
            computed: {
                className() {
                    return this.unknownLanguage
                        ? ''
                        : 'hljs ' + this.detectedLanguage
                },
                highlighted() {
                    if (!this.autoDetect && !hljs.getLanguage(this.language))
                        return (
                            console.warn(
                                `The language "${this.language}" you specified could not be found.`
                            ),
                            (this.unknownLanguage = !0),
                            t(this.code)
                        )
                    let e
                    return (
                        this.autoDetect
                            ? ((e = hljs.highlightAuto(this.code)),
                              (this.detectedLanguage = e.language))
                            : ((e = hljs.highlight(
                                  this.language,
                                  this.code,
                                  this.ignoreIllegals
                              )),
                              (this.detectectLanguage = this.language)),
                        e.value
                    )
                },
                autoDetect() {
                    return !(
                        this.language && ((e = this.autodetect), !e && '' !== e)
                    )
                    var e
                },
                ignoreIllegals: () => !0
            },
            render(e) {
                return e('pre', {}, [
                    e('code', {
                        class: this.className,
                        domProps: { innerHTML: this.highlighted }
                    })
                ])
            }
        },
        R = {
            install(e) {
                e.component('highlightjs', y)
            }
        },
        k = t,
        O = r,
        { nodeStream: M, mergeStreams: L } = i,
        T = Symbol('nomatch')
    return (function (t) {
        var a = [],
            i = Object.create(null),
            s = Object.create(null),
            o = [],
            l = !0,
            c = /(^(<[^>]+>|\t|)+|\n)/gm,
            d =
                "Could not find the language '{}', did you forget to load/include a language module?"
        const h = { disableAutodetect: !0, name: 'Plain text', contains: [] }
        var f = {
            noHighlightRe: /^(no-?highlight)$/i,
            languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
            classPrefix: 'hljs-',
            tabReplace: null,
            useBR: !1,
            languages: null,
            __emitter: u
        }
        function p(e) {
            return f.noHighlightRe.test(e)
        }
        function m(e, n, t, r) {
            var a = { code: n, language: e }
            S('before:highlight', a)
            var i = a.result ? a.result : b(a.language, a.code, t, r)
            return (i.code = a.code), S('after:highlight', i), i
        }
        function b(e, t, a, s) {
            var o = t
            function c(e, n) {
                var t = E.case_insensitive ? n[0].toLowerCase() : n[0]
                return (
                    Object.prototype.hasOwnProperty.call(e.keywords, t) &&
                    e.keywords[t]
                )
            }
            function u() {
                null != R.subLanguage
                    ? (function () {
                          if ('' !== L) {
                              var e = null
                              if ('string' == typeof R.subLanguage) {
                                  if (!i[R.subLanguage])
                                      return void M.addText(L)
                                  ;(e = b(
                                      R.subLanguage,
                                      L,
                                      !0,
                                      O[R.subLanguage]
                                  )),
                                      (O[R.subLanguage] = e.top)
                              } else
                                  e = v(
                                      L,
                                      R.subLanguage.length
                                          ? R.subLanguage
                                          : null
                                  )
                              R.relevance > 0 && (j += e.relevance),
                                  M.addSublanguage(e.emitter, e.language)
                          }
                      })()
                    : (function () {
                          if (!R.keywords) return void M.addText(L)
                          let e = 0
                          R.keywordPatternRe.lastIndex = 0
                          let n = R.keywordPatternRe.exec(L),
                              t = ''
                          for (; n; ) {
                              t += L.substring(e, n.index)
                              const r = c(R, n)
                              if (r) {
                                  const [e, a] = r
                                  M.addText(t),
                                      (t = ''),
                                      (j += a),
                                      M.addKeyword(n[0], e)
                              } else t += n[0]
                              ;(e = R.keywordPatternRe.lastIndex),
                                  (n = R.keywordPatternRe.exec(L))
                          }
                          ;(t += L.substr(e)), M.addText(t)
                      })(),
                    (L = '')
            }
            function h(e) {
                return (
                    e.className && M.openNode(e.className),
                    (R = Object.create(e, { parent: { value: R } }))
                )
            }
            function p(e) {
                return 0 === R.matcher.regexIndex
                    ? ((L += e[0]), 1)
                    : ((I = !0), 0)
            }
            var m = {}
            function x(t, r) {
                var i = r && r[0]
                if (((L += t), null == i)) return u(), 0
                if (
                    'begin' === m.type &&
                    'end' === r.type &&
                    m.index === r.index &&
                    '' === i
                ) {
                    if (((L += o.slice(r.index, r.index + 1)), !l)) {
                        const n = Error('0 width match regex')
                        throw ((n.languageName = e), (n.badRule = m.rule), n)
                    }
                    return 1
                }
                if (((m = r), 'begin' === r.type))
                    return (function (e) {
                        var t = e[0],
                            r = e.rule
                        const a = new n(r),
                            i = [r.__beforeBegin, r['on:begin']]
                        for (const n of i)
                            if (n && (n(e, a), a.ignore)) return p(t)
                        return (
                            r &&
                                r.endSameAsBegin &&
                                (r.endRe = RegExp(
                                    t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
                                    'm'
                                )),
                            r.skip
                                ? (L += t)
                                : (r.excludeBegin && (L += t),
                                  u(),
                                  r.returnBegin || r.excludeBegin || (L = t)),
                            h(r),
                            r.returnBegin ? 0 : t.length
                        )
                    })(r)
                if ('illegal' === r.type && !a) {
                    const e = Error(
                        'Illegal lexeme "' +
                            i +
                            '" for mode "' +
                            (R.className || '<unnamed>') +
                            '"'
                    )
                    throw ((e.mode = R), e)
                }
                if ('end' === r.type) {
                    var s = (function (e) {
                        var t = e[0],
                            r = o.substr(e.index),
                            a = (function e(t, r, a) {
                                let i = (function (e, n) {
                                    var t = e && e.exec(n)
                                    return t && 0 === t.index
                                })(t.endRe, a)
                                if (i) {
                                    if (t['on:end']) {
                                        const e = new n(t)
                                        t['on:end'](r, e), e.ignore && (i = !1)
                                    }
                                    if (i) {
                                        for (; t.endsParent && t.parent; )
                                            t = t.parent
                                        return t
                                    }
                                }
                                if (t.endsWithParent) return e(t.parent, r, a)
                            })(R, e, r)
                        if (!a) return T
                        var i = R
                        i.skip
                            ? (L += t)
                            : (i.returnEnd || i.excludeEnd || (L += t),
                              u(),
                              i.excludeEnd && (L = t))
                        do {
                            R.className && M.closeNode(),
                                R.skip || R.subLanguage || (j += R.relevance),
                                (R = R.parent)
                        } while (R !== a.parent)
                        return (
                            a.starts &&
                                (a.endSameAsBegin && (a.starts.endRe = a.endRe),
                                h(a.starts)),
                            i.returnEnd ? 0 : t.length
                        )
                    })(r)
                    if (s !== T) return s
                }
                if ('illegal' === r.type && '' === i) return 1
                if (S > 1e5 && S > 3 * r.index)
                    throw Error(
                        'potential infinite loop, way more iterations than matches'
                    )
                return (L += i), i.length
            }
            var E = y(e)
            if (!E)
                throw (
                    (console.error(d.replace('{}', e)),
                    Error('Unknown language: "' + e + '"'))
                )
            var _ = (function (e) {
                    function n(n, t) {
                        return RegExp(
                            g(n),
                            'm' +
                                (e.case_insensitive ? 'i' : '') +
                                (t ? 'g' : '')
                        )
                    }
                    class t {
                        constructor() {
                            ;(this.matchIndexes = {}),
                                (this.regexes = []),
                                (this.matchAt = 1),
                                (this.position = 0)
                        }
                        addRule(e, n) {
                            ;(n.position = this.position++),
                                (this.matchIndexes[this.matchAt] = n),
                                this.regexes.push([n, e]),
                                (this.matchAt +=
                                    (function (e) {
                                        return (
                                            RegExp(e.toString() + '|').exec('')
                                                .length - 1
                                        )
                                    })(e) + 1)
                        }
                        compile() {
                            0 === this.regexes.length &&
                                (this.exec = () => null)
                            const e = this.regexes.map((e) => e[1])
                            ;(this.matcherRe = n(
                                (function (e, n = '|') {
                                    for (
                                        var t =
                                                /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./,
                                            r = 0,
                                            a = '',
                                            i = 0;
                                        i < e.length;
                                        i++
                                    ) {
                                        var s = (r += 1),
                                            o = g(e[i])
                                        for (
                                            i > 0 && (a += n), a += '(';
                                            o.length > 0;

                                        ) {
                                            var l = t.exec(o)
                                            if (null == l) {
                                                a += o
                                                break
                                            }
                                            ;(a += o.substring(0, l.index)),
                                                (o = o.substring(
                                                    l.index + l[0].length
                                                )),
                                                '\\' === l[0][0] && l[1]
                                                    ? (a += '\\' + (+l[1] + s))
                                                    : ((a += l[0]),
                                                      '(' === l[0] && r++)
                                        }
                                        a += ')'
                                    }
                                    return a
                                })(e),
                                !0
                            )),
                                (this.lastIndex = 0)
                        }
                        exec(e) {
                            this.matcherRe.lastIndex = this.lastIndex
                            const n = this.matcherRe.exec(e)
                            if (!n) return null
                            const t = n.findIndex(
                                    (e, n) => n > 0 && void 0 !== e
                                ),
                                r = this.matchIndexes[t]
                            return n.splice(0, t), Object.assign(n, r)
                        }
                    }
                    class a {
                        constructor() {
                            ;(this.rules = []),
                                (this.multiRegexes = []),
                                (this.count = 0),
                                (this.lastIndex = 0),
                                (this.regexIndex = 0)
                        }
                        getMatcher(e) {
                            if (this.multiRegexes[e])
                                return this.multiRegexes[e]
                            const n = new t()
                            return (
                                this.rules
                                    .slice(e)
                                    .forEach(([e, t]) => n.addRule(e, t)),
                                n.compile(),
                                (this.multiRegexes[e] = n),
                                n
                            )
                        }
                        resumingScanAtSamePosition() {
                            return 0 != this.regexIndex
                        }
                        considerAll() {
                            this.regexIndex = 0
                        }
                        addRule(e, n) {
                            this.rules.push([e, n]),
                                'begin' === n.type && this.count++
                        }
                        exec(e) {
                            const n = this.getMatcher(this.regexIndex)
                            n.lastIndex = this.lastIndex
                            const t = n.exec(e)
                            return (
                                t &&
                                    ((this.regexIndex += t.position + 1),
                                    this.regexIndex === this.count &&
                                        (this.regexIndex = 0)),
                                t
                            )
                        }
                    }
                    function i(e, n) {
                        const t = e.input[e.index - 1],
                            r = e.input[e.index + e[0].length]
                        ;('.' !== t && '.' !== r) || n.ignoreMatch()
                    }
                    if (e.contains && e.contains.includes('self'))
                        throw Error(
                            'ERR: contains `self` is not supported at the top-level of a language.  See documentation.'
                        )
                    return (function t(s, o) {
                        const l = s
                        if (s.compiled) return l
                        ;(s.compiled = !0),
                            (s.__beforeBegin = null),
                            (s.keywords = s.keywords || s.beginKeywords)
                        let c = null
                        if (
                            ('object' == typeof s.keywords &&
                                ((c = s.keywords.$pattern),
                                delete s.keywords.$pattern),
                            s.keywords &&
                                (s.keywords = (function (e, n) {
                                    var t = {}
                                    return (
                                        'string' == typeof e
                                            ? r('keyword', e)
                                            : Object.keys(e).forEach(function (
                                                  n
                                              ) {
                                                  r(n, e[n])
                                              }),
                                        t
                                    )
                                    function r(e, r) {
                                        n && (r = r.toLowerCase()),
                                            r.split(' ').forEach(function (n) {
                                                var r = n.split('|')
                                                t[r[0]] = [e, N(r[0], r[1])]
                                            })
                                    }
                                })(s.keywords, e.case_insensitive)),
                            s.lexemes && c)
                        )
                            throw Error(
                                'ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) '
                            )
                        return (
                            (l.keywordPatternRe = n(
                                s.lexemes || c || /\w+/,
                                !0
                            )),
                            o &&
                                (s.beginKeywords &&
                                    ((s.begin =
                                        '\\b(' +
                                        s.beginKeywords.split(' ').join('|') +
                                        ')(?=\\b|\\s)'),
                                    (s.__beforeBegin = i)),
                                s.begin || (s.begin = /\B|\b/),
                                (l.beginRe = n(s.begin)),
                                s.endSameAsBegin && (s.end = s.begin),
                                s.end || s.endsWithParent || (s.end = /\B|\b/),
                                s.end && (l.endRe = n(s.end)),
                                (l.terminator_end = g(s.end) || ''),
                                s.endsWithParent &&
                                    o.terminator_end &&
                                    (l.terminator_end +=
                                        (s.end ? '|' : '') + o.terminator_end)),
                            s.illegal && (l.illegalRe = n(s.illegal)),
                            void 0 === s.relevance && (s.relevance = 1),
                            s.contains || (s.contains = []),
                            (s.contains = [].concat(
                                ...s.contains.map(function (e) {
                                    return (function (e) {
                                        return (
                                            e.variants &&
                                                !e.cached_variants &&
                                                (e.cached_variants =
                                                    e.variants.map(function (
                                                        n
                                                    ) {
                                                        return r(
                                                            e,
                                                            { variants: null },
                                                            n
                                                        )
                                                    })),
                                            e.cached_variants
                                                ? e.cached_variants
                                                : (function e(n) {
                                                      return (
                                                          !!n &&
                                                          (n.endsWithParent ||
                                                              e(n.starts))
                                                      )
                                                  })(e)
                                                ? r(e, {
                                                      starts: e.starts
                                                          ? r(e.starts)
                                                          : null
                                                  })
                                                : Object.isFrozen(e)
                                                ? r(e)
                                                : e
                                        )
                                    })('self' === e ? s : e)
                                })
                            )),
                            s.contains.forEach(function (e) {
                                t(e, l)
                            }),
                            s.starts && t(s.starts, o),
                            (l.matcher = (function (e) {
                                const n = new a()
                                return (
                                    e.contains.forEach((e) =>
                                        n.addRule(e.begin, {
                                            rule: e,
                                            type: 'begin'
                                        })
                                    ),
                                    e.terminator_end &&
                                        n.addRule(e.terminator_end, {
                                            type: 'end'
                                        }),
                                    e.illegal &&
                                        n.addRule(e.illegal, {
                                            type: 'illegal'
                                        }),
                                    n
                                )
                            })(l)),
                            l
                        )
                    })(e)
                })(E),
                w = '',
                R = s || _,
                O = {},
                M = new f.__emitter(f)
            !(function () {
                for (var e = [], n = R; n !== E; n = n.parent)
                    n.className && e.unshift(n.className)
                e.forEach((e) => M.openNode(e))
            })()
            var L = '',
                j = 0,
                A = 0,
                S = 0,
                I = !1
            try {
                for (R.matcher.considerAll(); ; ) {
                    S++,
                        I
                            ? (I = !1)
                            : ((R.matcher.lastIndex = A),
                              R.matcher.considerAll())
                    const e = R.matcher.exec(o)
                    if (!e && R.matcher.resumingScanAtSamePosition()) {
                        ;(L += o[A]), (A += 1)
                        continue
                    }
                    if (!e) break
                    const n = x(o.substring(A, e.index), e)
                    A = e.index + n
                }
                return (
                    x(o.substr(A)),
                    M.closeAllNodes(),
                    M.finalize(),
                    (w = M.toHTML()),
                    {
                        relevance: j,
                        value: w,
                        language: e,
                        illegal: !1,
                        emitter: M,
                        top: R
                    }
                )
            } catch (n) {
                if (n.message && n.message.includes('Illegal'))
                    return {
                        illegal: !0,
                        illegalBy: {
                            msg: n.message,
                            context: o.slice(A - 100, A + 100),
                            mode: n.mode
                        },
                        sofar: w,
                        relevance: 0,
                        value: k(o),
                        emitter: M
                    }
                if (l)
                    return {
                        illegal: !1,
                        relevance: 0,
                        value: k(o),
                        emitter: M,
                        language: e,
                        top: R,
                        errorRaised: n
                    }
                throw n
            }
        }
        function v(e, n) {
            n = n || f.languages || Object.keys(i)
            var t = (function (e) {
                    const n = {
                        relevance: 0,
                        emitter: new f.__emitter(f),
                        value: k(e),
                        illegal: !1,
                        top: h
                    }
                    return n.emitter.addText(e), n
                })(e),
                r = t
            return (
                n
                    .filter(y)
                    .filter(A)
                    .forEach(function (n) {
                        var a = b(n, e, !1)
                        ;(a.language = n),
                            a.relevance > r.relevance && (r = a),
                            a.relevance > t.relevance && ((r = t), (t = a))
                    }),
                r.language && (t.second_best = r),
                t
            )
        }
        function x(e) {
            return f.tabReplace || f.useBR
                ? e.replace(c, (e) =>
                      '\n' === e
                          ? f.useBR
                              ? '<br>'
                              : e
                          : f.tabReplace
                          ? e.replace(/\t/g, f.tabReplace)
                          : e
                  )
                : e
        }
        function E(e) {
            let n = null
            const t = (function (e) {
                var n = e.className + ' '
                n += e.parentNode ? e.parentNode.className : ''
                const t = f.languageDetectRe.exec(n)
                if (t) {
                    var r = y(t[1])
                    return (
                        r ||
                            (console.warn(d.replace('{}', t[1])),
                            console.warn(
                                'Falling back to no-highlight mode for this block.',
                                e
                            )),
                        r ? t[1] : 'no-highlight'
                    )
                }
                return n.split(/\s+/).find((e) => p(e) || y(e))
            })(e)
            if (p(t)) return
            S('before:highlightBlock', { block: e, language: t }),
                f.useBR
                    ? ((n = document.createElement('div')).innerHTML =
                          e.innerHTML
                              .replace(/\n/g, '')
                              .replace(/<br[ /]*>/g, '\n'))
                    : (n = e)
            const r = n.textContent,
                a = t ? m(t, r, !0) : v(r),
                i = M(n)
            if (i.length) {
                const e = document.createElement('div')
                ;(e.innerHTML = a.value), (a.value = L(i, M(e), r))
            }
            ;(a.value = x(a.value)),
                S('after:highlightBlock', { block: e, result: a }),
                (e.innerHTML = a.value),
                (e.className = (function (e, n, t) {
                    var r = n ? s[n] : t,
                        a = [e.trim()]
                    return (
                        e.match(/\bhljs\b/) || a.push('hljs'),
                        e.includes(r) || a.push(r),
                        a.join(' ').trim()
                    )
                })(e.className, t, a.language)),
                (e.result = {
                    language: a.language,
                    re: a.relevance,
                    relavance: a.relevance
                }),
                a.second_best &&
                    (e.second_best = {
                        language: a.second_best.language,
                        re: a.second_best.relevance,
                        relavance: a.second_best.relevance
                    })
        }
        const w = () => {
            if (!w.called) {
                w.called = !0
                var e = document.querySelectorAll('pre code')
                a.forEach.call(e, E)
            }
        }
        function y(e) {
            return (e = (e || '').toLowerCase()), i[e] || i[s[e]]
        }
        function j(e, { languageName: n }) {
            'string' == typeof e && (e = [e]),
                e.forEach((e) => {
                    s[e] = n
                })
        }
        function A(e) {
            var n = y(e)
            return n && !n.disableAutodetect
        }
        function S(e, n) {
            var t = e
            o.forEach(function (e) {
                e[t] && e[t](n)
            })
        }
        Object.assign(t, {
            highlight: m,
            highlightAuto: v,
            fixMarkup: function (e) {
                return (
                    console.warn(
                        'fixMarkup is deprecated and will be removed entirely in v11.0'
                    ),
                    console.warn(
                        'Please see https://github.com/highlightjs/highlight.js/issues/2534'
                    ),
                    x(e)
                )
            },
            highlightBlock: E,
            configure: function (e) {
                f = O(f, e)
            },
            initHighlighting: w,
            initHighlightingOnLoad: function () {
                window.addEventListener('DOMContentLoaded', w, !1)
            },
            registerLanguage: function (e, n) {
                var r = null
                try {
                    r = n(t)
                } catch (n) {
                    if (
                        (console.error(
                            "Language definition for '{}' could not be registered.".replace(
                                '{}',
                                e
                            )
                        ),
                        !l)
                    )
                        throw n
                    console.error(n), (r = h)
                }
                r.name || (r.name = e),
                    (i[e] = r),
                    (r.rawDefinition = n.bind(null, t)),
                    r.aliases && j(r.aliases, { languageName: e })
            },
            listLanguages: function () {
                return Object.keys(i)
            },
            getLanguage: y,
            registerAliases: j,
            requireLanguage: function (e) {
                var n = y(e)
                if (n) return n
                throw Error(
                    "The '{}' language is required, but not loaded.".replace(
                        '{}',
                        e
                    )
                )
            },
            autoDetection: A,
            inherit: O,
            addPlugin: function (e) {
                o.push(e)
            },
            vuePlugin: R
        }),
            (t.debugMode = function () {
                l = !1
            }),
            (t.safeMode = function () {
                l = !0
            }),
            (t.versionString = '10.2.0')
        for (const n in _) 'object' == typeof _[n] && e(_[n])
        return Object.assign(t, _), t
    })({})
})()
'object' == typeof exports &&
    'undefined' != typeof module &&
    (module.exports = hljs)
hljs.registerLanguage(
    'json',
    (function () {
        'use strict'
        return function (n) {
            var e = { literal: 'true false null' },
                i = [n.C_LINE_COMMENT_MODE, n.C_BLOCK_COMMENT_MODE],
                t = [n.QUOTE_STRING_MODE, n.C_NUMBER_MODE],
                a = {
                    end: ',',
                    endsWithParent: !0,
                    excludeEnd: !0,
                    contains: t,
                    keywords: e
                },
                l = {
                    begin: '{',
                    end: '}',
                    contains: [
                        {
                            className: 'attr',
                            begin: /"/,
                            end: /"/,
                            contains: [n.BACKSLASH_ESCAPE],
                            illegal: '\\n'
                        },
                        n.inherit(a, { begin: /:/ })
                    ].concat(i),
                    illegal: '\\S'
                },
                s = {
                    begin: '\\[',
                    end: '\\]',
                    contains: [n.inherit(a)],
                    illegal: '\\S'
                }
            return (
                t.push(l, s),
                i.forEach(function (n) {
                    t.push(n)
                }),
                { name: 'JSON', contains: t, keywords: e, illegal: '\\S' }
            )
        }
    })()
)
hljs.registerLanguage(
    'c-like',
    (function () {
        'use strict'
        return function (e) {
            function t(e) {
                return '(?:' + e + ')?'
            }
            var n =
                    '(decltype\\(auto\\)|' +
                    t('[a-zA-Z_]\\w*::') +
                    '[a-zA-Z_]\\w*' +
                    t('<.*?>') +
                    ')',
                r = { className: 'keyword', begin: '\\b[a-z\\d_]*_t\\b' },
                a = {
                    className: 'string',
                    variants: [
                        {
                            begin: '(u8?|U|L)?"',
                            end: '"',
                            illegal: '\\n',
                            contains: [e.BACKSLASH_ESCAPE]
                        },
                        {
                            begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
                            end: "'",
                            illegal: '.'
                        },
                        e.END_SAME_AS_BEGIN({
                            begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
                            end: /\)([^()\\ ]{0,16})"/
                        })
                    ]
                },
                i = {
                    className: 'number',
                    variants: [
                        { begin: "\\b(0b[01']+)" },
                        {
                            begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"
                        },
                        {
                            begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
                        }
                    ],
                    relevance: 0
                },
                s = {
                    className: 'meta',
                    begin: /#\s*[a-z]+\b/,
                    end: /$/,
                    keywords: {
                        'meta-keyword':
                            'if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include'
                    },
                    contains: [
                        { begin: /\\\n/, relevance: 0 },
                        e.inherit(a, { className: 'meta-string' }),
                        {
                            className: 'meta-string',
                            begin: /<.*?>/,
                            end: /$/,
                            illegal: '\\n'
                        },
                        e.C_LINE_COMMENT_MODE,
                        e.C_BLOCK_COMMENT_MODE
                    ]
                },
                o = {
                    className: 'title',
                    begin: t('[a-zA-Z_]\\w*::') + e.IDENT_RE,
                    relevance: 0
                },
                c = t('[a-zA-Z_]\\w*::') + e.IDENT_RE + '\\s*\\(',
                l = {
                    keyword:
                        'int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq',
                    built_in:
                        'std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary',
                    literal: 'true false nullptr NULL'
                },
                d = [r, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, i, a],
                _ = {
                    variants: [
                        { begin: /=/, end: /;/ },
                        { begin: /\(/, end: /\)/ },
                        { beginKeywords: 'new throw return else', end: /;/ }
                    ],
                    keywords: l,
                    contains: d.concat([
                        {
                            begin: /\(/,
                            end: /\)/,
                            keywords: l,
                            contains: d.concat(['self']),
                            relevance: 0
                        }
                    ]),
                    relevance: 0
                },
                u = {
                    className: 'function',
                    begin: '(' + n + '[\\*&\\s]+)+' + c,
                    returnBegin: !0,
                    end: /[{;=]/,
                    excludeEnd: !0,
                    keywords: l,
                    illegal: /[^\w\s\*&:<>]/,
                    contains: [
                        {
                            begin: 'decltype\\(auto\\)',
                            keywords: l,
                            relevance: 0
                        },
                        {
                            begin: c,
                            returnBegin: !0,
                            contains: [o],
                            relevance: 0
                        },
                        {
                            className: 'params',
                            begin: /\(/,
                            end: /\)/,
                            keywords: l,
                            relevance: 0,
                            contains: [
                                e.C_LINE_COMMENT_MODE,
                                e.C_BLOCK_COMMENT_MODE,
                                a,
                                i,
                                r,
                                {
                                    begin: /\(/,
                                    end: /\)/,
                                    keywords: l,
                                    relevance: 0,
                                    contains: [
                                        'self',
                                        e.C_LINE_COMMENT_MODE,
                                        e.C_BLOCK_COMMENT_MODE,
                                        a,
                                        i,
                                        r
                                    ]
                                }
                            ]
                        },
                        r,
                        e.C_LINE_COMMENT_MODE,
                        e.C_BLOCK_COMMENT_MODE,
                        s
                    ]
                }
            return {
                aliases: [
                    'c',
                    'cc',
                    'h',
                    'c++',
                    'h++',
                    'hpp',
                    'hh',
                    'hxx',
                    'cxx'
                ],
                keywords: l,
                disableAutodetect: !0,
                illegal: '</',
                contains: [].concat(_, u, d, [
                    s,
                    {
                        begin: '\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<',
                        end: '>',
                        keywords: l,
                        contains: ['self', r]
                    },
                    { begin: e.IDENT_RE + '::', keywords: l },
                    {
                        className: 'class',
                        beginKeywords: 'class struct',
                        end: /[{;:]/,
                        contains: [
                            { begin: /</, end: />/, contains: ['self'] },
                            e.TITLE_MODE
                        ]
                    }
                ]),
                exports: { preprocessor: s, strings: a, keywords: l }
            }
        }
    })()
)
hljs.registerLanguage(
    'bash',
    (function () {
        'use strict'
        return function (e) {
            const s = {}
            Object.assign(s, {
                className: 'variable',
                variants: [
                    { begin: /\$[\w\d#@][\w\d_]*/ },
                    {
                        begin: /\$\{/,
                        end: /\}/,
                        contains: [{ begin: /:-/, contains: [s] }]
                    }
                ]
            })
            const t = {
                    className: 'subst',
                    begin: /\$\(/,
                    end: /\)/,
                    contains: [e.BACKSLASH_ESCAPE]
                },
                n = {
                    className: 'string',
                    begin: /"/,
                    end: /"/,
                    contains: [e.BACKSLASH_ESCAPE, s, t]
                }
            t.contains.push(n)
            const a = {
                    begin: /\$\(\(/,
                    end: /\)\)/,
                    contains: [
                        { begin: /\d+#[0-9a-f]+/, className: 'number' },
                        e.NUMBER_MODE,
                        s
                    ]
                },
                i = e.SHEBANG({
                    binary: '(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)',
                    relevance: 10
                }),
                c = {
                    className: 'function',
                    begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
                    returnBegin: !0,
                    contains: [
                        e.inherit(e.TITLE_MODE, { begin: /\w[\w\d_]*/ })
                    ],
                    relevance: 0
                }
            return {
                name: 'Bash',
                aliases: ['sh', 'zsh'],
                keywords: {
                    $pattern: /\b-?[a-z\._-]+\b/,
                    keyword:
                        'if then else elif fi for while in do done case esac function',
                    literal: 'true false',
                    built_in:
                        'break cd continue eval exec exit export getopts hash pwd readonly return shift test times trap umask unset alias bind builtin caller command declare echo enable help let local logout mapfile printf read readarray source type typeset ulimit unalias set shopt autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate fc fg float functions getcap getln history integer jobs kill limit log noglob popd print pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof zpty zregexparse zsocket zstyle ztcp',
                    _: '-ne -eq -lt -gt -f -d -e -s -l -a'
                },
                contains: [
                    i,
                    e.SHEBANG(),
                    c,
                    a,
                    e.HASH_COMMENT_MODE,
                    n,
                    { className: '', begin: /\\"/ },
                    { className: 'string', begin: /'/, end: /'/ },
                    s
                ]
            }
        }
    })()
)
hljs.registerLanguage(
    'python',
    (function () {
        'use strict'
        return function (e) {
            var n = {
                    keyword:
                        'and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda async await nonlocal|10',
                    built_in: 'Ellipsis NotImplemented',
                    literal: 'False None True'
                },
                a = { className: 'meta', begin: /^(>>>|\.\.\.) / },
                i = {
                    className: 'subst',
                    begin: /\{/,
                    end: /\}/,
                    keywords: n,
                    illegal: /#/
                },
                s = { begin: /\{\{/, relevance: 0 },
                r = {
                    className: 'string',
                    contains: [e.BACKSLASH_ESCAPE],
                    variants: [
                        {
                            begin: /(u|b)?r?'''/,
                            end: /'''/,
                            contains: [e.BACKSLASH_ESCAPE, a],
                            relevance: 10
                        },
                        {
                            begin: /(u|b)?r?"""/,
                            end: /"""/,
                            contains: [e.BACKSLASH_ESCAPE, a],
                            relevance: 10
                        },
                        {
                            begin: /(fr|rf|f)'''/,
                            end: /'''/,
                            contains: [e.BACKSLASH_ESCAPE, a, s, i]
                        },
                        {
                            begin: /(fr|rf|f)"""/,
                            end: /"""/,
                            contains: [e.BACKSLASH_ESCAPE, a, s, i]
                        },
                        { begin: /(u|r|ur)'/, end: /'/, relevance: 10 },
                        { begin: /(u|r|ur)"/, end: /"/, relevance: 10 },
                        { begin: /(b|br)'/, end: /'/ },
                        { begin: /(b|br)"/, end: /"/ },
                        {
                            begin: /(fr|rf|f)'/,
                            end: /'/,
                            contains: [e.BACKSLASH_ESCAPE, s, i]
                        },
                        {
                            begin: /(fr|rf|f)"/,
                            end: /"/,
                            contains: [e.BACKSLASH_ESCAPE, s, i]
                        },
                        e.APOS_STRING_MODE,
                        e.QUOTE_STRING_MODE
                    ]
                },
                l = {
                    className: 'number',
                    relevance: 0,
                    variants: [
                        { begin: e.BINARY_NUMBER_RE + '[lLjJ]?' },
                        { begin: '\\b(0o[0-7]+)[lLjJ]?' },
                        { begin: e.C_NUMBER_RE + '[lLjJ]?' }
                    ]
                },
                t = {
                    className: 'params',
                    variants: [
                        { begin: /\(\s*\)/, skip: !0, className: null },
                        {
                            begin: /\(/,
                            end: /\)/,
                            excludeBegin: !0,
                            excludeEnd: !0,
                            contains: ['self', a, l, r, e.HASH_COMMENT_MODE]
                        }
                    ]
                }
            return (
                (i.contains = [r, l, a]),
                {
                    name: 'Python',
                    aliases: ['py', 'gyp', 'ipython'],
                    keywords: n,
                    illegal: /(<\/|->|\?)|=>/,
                    contains: [
                        a,
                        l,
                        { beginKeywords: 'if', relevance: 0 },
                        r,
                        e.HASH_COMMENT_MODE,
                        {
                            variants: [
                                { className: 'function', beginKeywords: 'def' },
                                { className: 'class', beginKeywords: 'class' }
                            ],
                            end: /:/,
                            illegal: /[${=;\n,]/,
                            contains: [
                                e.UNDERSCORE_TITLE_MODE,
                                t,
                                {
                                    begin: /->/,
                                    endsWithParent: !0,
                                    keywords: 'None'
                                }
                            ]
                        },
                        { className: 'meta', begin: /^[\t ]*@/, end: /$/ },
                        { begin: /\b(print|exec)\(/ }
                    ]
                }
            )
        }
    })()
)
hljs.registerLanguage(
    'c',
    (function () {
        'use strict'
        return function (e) {
            var n = e.requireLanguage('c-like').rawDefinition()
            return (n.name = 'C'), (n.aliases = ['c', 'h']), n
        }
    })()
)
hljs.registerLanguage(
    'javascript',
    (function () {
        'use strict'
        const e = [
                'as',
                'in',
                'of',
                'if',
                'for',
                'while',
                'finally',
                'var',
                'new',
                'function',
                'do',
                'return',
                'void',
                'else',
                'break',
                'catch',
                'instanceof',
                'with',
                'throw',
                'case',
                'default',
                'try',
                'switch',
                'continue',
                'typeof',
                'delete',
                'let',
                'yield',
                'const',
                'class',
                'debugger',
                'async',
                'await',
                'static',
                'import',
                'from',
                'export',
                'extends'
            ],
            n = ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'],
            a = [].concat(
                [
                    'setInterval',
                    'setTimeout',
                    'clearInterval',
                    'clearTimeout',
                    'require',
                    'exports',
                    'eval',
                    'isFinite',
                    'isNaN',
                    'parseFloat',
                    'parseInt',
                    'decodeURI',
                    'decodeURIComponent',
                    'encodeURI',
                    'encodeURIComponent',
                    'escape',
                    'unescape'
                ],
                [
                    'arguments',
                    'this',
                    'super',
                    'console',
                    'window',
                    'document',
                    'localStorage',
                    'module',
                    'global'
                ],
                [
                    'Intl',
                    'DataView',
                    'Number',
                    'Math',
                    'Date',
                    'String',
                    'RegExp',
                    'Object',
                    'Function',
                    'Boolean',
                    'Error',
                    'Symbol',
                    'Set',
                    'Map',
                    'WeakSet',
                    'WeakMap',
                    'Proxy',
                    'Reflect',
                    'JSON',
                    'Promise',
                    'Float64Array',
                    'Int16Array',
                    'Int32Array',
                    'Int8Array',
                    'Uint16Array',
                    'Uint32Array',
                    'Float32Array',
                    'Array',
                    'Uint8Array',
                    'Uint8ClampedArray',
                    'ArrayBuffer'
                ],
                [
                    'EvalError',
                    'InternalError',
                    'RangeError',
                    'ReferenceError',
                    'SyntaxError',
                    'TypeError',
                    'URIError'
                ]
            )
        function s(e) {
            return r('(?=', e, ')')
        }
        function r(...e) {
            return e
                .map((e) =>
                    (function (e) {
                        return e ? ('string' == typeof e ? e : e.source) : null
                    })(e)
                )
                .join('')
        }
        return function (t) {
            var i = '[A-Za-z$_][0-9A-Za-z$_]*',
                c = {
                    begin: /<[A-Za-z0-9\\._:-]+/,
                    end: /\/[A-Za-z0-9\\._:-]+>|\/>/
                },
                o = {
                    $pattern: '[A-Za-z$_][0-9A-Za-z$_]*',
                    keyword: e.join(' '),
                    literal: n.join(' '),
                    built_in: a.join(' ')
                },
                l = {
                    className: 'number',
                    variants: [
                        { begin: '\\b(0[bB][01]+)n?' },
                        { begin: '\\b(0[oO][0-7]+)n?' },
                        { begin: t.C_NUMBER_RE + 'n?' }
                    ],
                    relevance: 0
                },
                E = {
                    className: 'subst',
                    begin: '\\$\\{',
                    end: '\\}',
                    keywords: o,
                    contains: []
                },
                d = {
                    begin: 'html`',
                    end: '',
                    starts: {
                        end: '`',
                        returnEnd: !1,
                        contains: [t.BACKSLASH_ESCAPE, E],
                        subLanguage: 'xml'
                    }
                },
                g = {
                    begin: 'css`',
                    end: '',
                    starts: {
                        end: '`',
                        returnEnd: !1,
                        contains: [t.BACKSLASH_ESCAPE, E],
                        subLanguage: 'css'
                    }
                },
                u = {
                    className: 'string',
                    begin: '`',
                    end: '`',
                    contains: [t.BACKSLASH_ESCAPE, E]
                }
            E.contains = [
                t.APOS_STRING_MODE,
                t.QUOTE_STRING_MODE,
                d,
                g,
                u,
                l,
                t.REGEXP_MODE
            ]
            var b = E.contains.concat([
                    {
                        begin: /\(/,
                        end: /\)/,
                        contains: ['self'].concat(E.contains, [
                            t.C_BLOCK_COMMENT_MODE,
                            t.C_LINE_COMMENT_MODE
                        ])
                    },
                    t.C_BLOCK_COMMENT_MODE,
                    t.C_LINE_COMMENT_MODE
                ]),
                _ = {
                    className: 'params',
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    contains: b
                }
            return {
                name: 'JavaScript',
                aliases: ['js', 'jsx', 'mjs', 'cjs'],
                keywords: o,
                contains: [
                    t.SHEBANG({ binary: 'node', relevance: 5 }),
                    {
                        className: 'meta',
                        relevance: 10,
                        begin: /^\s*['"]use (strict|asm)['"]/
                    },
                    t.APOS_STRING_MODE,
                    t.QUOTE_STRING_MODE,
                    d,
                    g,
                    u,
                    t.C_LINE_COMMENT_MODE,
                    t.COMMENT('/\\*\\*', '\\*/', {
                        relevance: 0,
                        contains: [
                            {
                                className: 'doctag',
                                begin: '@[A-Za-z]+',
                                contains: [
                                    {
                                        className: 'type',
                                        begin: '\\{',
                                        end: '\\}',
                                        relevance: 0
                                    },
                                    {
                                        className: 'variable',
                                        begin: i + '(?=\\s*(-)|$)',
                                        endsParent: !0,
                                        relevance: 0
                                    },
                                    { begin: /(?=[^\n])\s/, relevance: 0 }
                                ]
                            }
                        ]
                    }),
                    t.C_BLOCK_COMMENT_MODE,
                    l,
                    {
                        begin: r(
                            /[{,\n]\s*/,
                            s(
                                r(
                                    /(((\/\/.*$)|(\/\*(.|\n)*\*\/))\s*)*/,
                                    i + '\\s*:'
                                )
                            )
                        ),
                        relevance: 0,
                        contains: [
                            {
                                className: 'attr',
                                begin: i + s('\\s*:'),
                                relevance: 0
                            }
                        ]
                    },
                    {
                        begin:
                            '(' +
                            t.RE_STARTERS_RE +
                            '|\\b(case|return|throw)\\b)\\s*',
                        keywords: 'return throw case',
                        contains: [
                            t.C_LINE_COMMENT_MODE,
                            t.C_BLOCK_COMMENT_MODE,
                            t.REGEXP_MODE,
                            {
                                className: 'function',
                                begin:
                                    '(\\([^(]*(\\([^(]*(\\([^(]*\\))?\\))?\\)|' +
                                    t.UNDERSCORE_IDENT_RE +
                                    ')\\s*=>',
                                returnBegin: !0,
                                end: '\\s*=>',
                                contains: [
                                    {
                                        className: 'params',
                                        variants: [
                                            { begin: t.UNDERSCORE_IDENT_RE },
                                            {
                                                className: null,
                                                begin: /\(\s*\)/,
                                                skip: !0
                                            },
                                            {
                                                begin: /\(/,
                                                end: /\)/,
                                                excludeBegin: !0,
                                                excludeEnd: !0,
                                                keywords: o,
                                                contains: b
                                            }
                                        ]
                                    }
                                ]
                            },
                            { begin: /,/, relevance: 0 },
                            {
                                className: '',
                                begin: /\s/,
                                end: /\s*/,
                                skip: !0
                            },
                            {
                                variants: [
                                    { begin: '<>', end: '</>' },
                                    { begin: c.begin, end: c.end }
                                ],
                                subLanguage: 'xml',
                                contains: [
                                    {
                                        begin: c.begin,
                                        end: c.end,
                                        skip: !0,
                                        contains: ['self']
                                    }
                                ]
                            }
                        ],
                        relevance: 0
                    },
                    {
                        className: 'function',
                        beginKeywords: 'function',
                        end: /\{/,
                        excludeEnd: !0,
                        contains: [t.inherit(t.TITLE_MODE, { begin: i }), _],
                        illegal: /\[|%/
                    },
                    { begin: /\$[(.]/ },
                    t.METHOD_GUARD,
                    {
                        className: 'class',
                        beginKeywords: 'class',
                        end: /[{;=]/,
                        excludeEnd: !0,
                        illegal: /[:"\[\]]/,
                        contains: [
                            { beginKeywords: 'extends' },
                            t.UNDERSCORE_TITLE_MODE
                        ]
                    },
                    { beginKeywords: 'constructor', end: /\{/, excludeEnd: !0 },
                    {
                        begin: '(get|set)\\s+(?=' + i + '\\()',
                        end: /{/,
                        keywords: 'get set',
                        contains: [
                            t.inherit(t.TITLE_MODE, { begin: i }),
                            { begin: /\(\)/ },
                            _
                        ]
                    }
                ],
                illegal: /#(?!!)/
            }
        }
    })()
)
hljs.registerLanguage(
    'go',
    (function () {
        'use strict'
        return function (e) {
            var n = {
                keyword:
                    'break default func interface select case map struct chan else goto package switch const fallthrough if range type continue for import return var go defer bool byte complex64 complex128 float32 float64 int8 int16 int32 int64 string uint8 uint16 uint32 uint64 int uint uintptr rune',
                literal: 'true false iota nil',
                built_in:
                    'append cap close complex copy imag len make new panic print println real recover delete'
            }
            return {
                name: 'Go',
                aliases: ['golang'],
                keywords: n,
                illegal: '</',
                contains: [
                    e.C_LINE_COMMENT_MODE,
                    e.C_BLOCK_COMMENT_MODE,
                    {
                        className: 'string',
                        variants: [
                            e.QUOTE_STRING_MODE,
                            e.APOS_STRING_MODE,
                            { begin: '`', end: '`' }
                        ]
                    },
                    {
                        className: 'number',
                        variants: [
                            { begin: e.C_NUMBER_RE + '[i]', relevance: 1 },
                            e.C_NUMBER_MODE
                        ]
                    },
                    { begin: /:=/ },
                    {
                        className: 'function',
                        beginKeywords: 'func',
                        end: '\\s*(\\{|$)',
                        excludeEnd: !0,
                        contains: [
                            e.TITLE_MODE,
                            {
                                className: 'params',
                                begin: /\(/,
                                end: /\)/,
                                keywords: n,
                                illegal: /["']/
                            }
                        ]
                    }
                ]
            }
        }
    })()
)
hljs.registerLanguage(
    'typescript',
    (function () {
        'use strict'
        const e = [
                'as',
                'in',
                'of',
                'if',
                'for',
                'while',
                'finally',
                'var',
                'new',
                'function',
                'do',
                'return',
                'void',
                'else',
                'break',
                'catch',
                'instanceof',
                'with',
                'throw',
                'case',
                'default',
                'try',
                'switch',
                'continue',
                'typeof',
                'delete',
                'let',
                'yield',
                'const',
                'class',
                'debugger',
                'async',
                'await',
                'static',
                'import',
                'from',
                'export',
                'extends'
            ],
            n = ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'],
            a = [].concat(
                [
                    'setInterval',
                    'setTimeout',
                    'clearInterval',
                    'clearTimeout',
                    'require',
                    'exports',
                    'eval',
                    'isFinite',
                    'isNaN',
                    'parseFloat',
                    'parseInt',
                    'decodeURI',
                    'decodeURIComponent',
                    'encodeURI',
                    'encodeURIComponent',
                    'escape',
                    'unescape'
                ],
                [
                    'arguments',
                    'this',
                    'super',
                    'console',
                    'window',
                    'document',
                    'localStorage',
                    'module',
                    'global'
                ],
                [
                    'Intl',
                    'DataView',
                    'Number',
                    'Math',
                    'Date',
                    'String',
                    'RegExp',
                    'Object',
                    'Function',
                    'Boolean',
                    'Error',
                    'Symbol',
                    'Set',
                    'Map',
                    'WeakSet',
                    'WeakMap',
                    'Proxy',
                    'Reflect',
                    'JSON',
                    'Promise',
                    'Float64Array',
                    'Int16Array',
                    'Int32Array',
                    'Int8Array',
                    'Uint16Array',
                    'Uint32Array',
                    'Float32Array',
                    'Array',
                    'Uint8Array',
                    'Uint8ClampedArray',
                    'ArrayBuffer'
                ],
                [
                    'EvalError',
                    'InternalError',
                    'RangeError',
                    'ReferenceError',
                    'SyntaxError',
                    'TypeError',
                    'URIError'
                ]
            )
        return function (r) {
            var t = {
                    $pattern: '[A-Za-z$_][0-9A-Za-z$_]*',
                    keyword: e
                        .concat([
                            'type',
                            'namespace',
                            'typedef',
                            'interface',
                            'public',
                            'private',
                            'protected',
                            'implements',
                            'declare',
                            'abstract',
                            'readonly'
                        ])
                        .join(' '),
                    literal: n.join(' '),
                    built_in: a
                        .concat([
                            'any',
                            'void',
                            'number',
                            'boolean',
                            'string',
                            'object',
                            'never',
                            'enum'
                        ])
                        .join(' ')
                },
                s = { className: 'meta', begin: '@[A-Za-z$_][0-9A-Za-z$_]*' },
                i = {
                    className: 'number',
                    variants: [
                        { begin: '\\b(0[bB][01]+)n?' },
                        { begin: '\\b(0[oO][0-7]+)n?' },
                        { begin: r.C_NUMBER_RE + 'n?' }
                    ],
                    relevance: 0
                },
                o = {
                    className: 'subst',
                    begin: '\\$\\{',
                    end: '\\}',
                    keywords: t,
                    contains: []
                },
                c = {
                    begin: 'html`',
                    end: '',
                    starts: {
                        end: '`',
                        returnEnd: !1,
                        contains: [r.BACKSLASH_ESCAPE, o],
                        subLanguage: 'xml'
                    }
                },
                l = {
                    begin: 'css`',
                    end: '',
                    starts: {
                        end: '`',
                        returnEnd: !1,
                        contains: [r.BACKSLASH_ESCAPE, o],
                        subLanguage: 'css'
                    }
                },
                E = {
                    className: 'string',
                    begin: '`',
                    end: '`',
                    contains: [r.BACKSLASH_ESCAPE, o]
                }
            o.contains = [
                r.APOS_STRING_MODE,
                r.QUOTE_STRING_MODE,
                c,
                l,
                E,
                i,
                r.REGEXP_MODE
            ]
            var d = {
                    begin: '\\(',
                    end: /\)/,
                    keywords: t,
                    contains: [
                        'self',
                        r.QUOTE_STRING_MODE,
                        r.APOS_STRING_MODE,
                        r.NUMBER_MODE
                    ]
                },
                u = {
                    className: 'params',
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: t,
                    contains: [
                        r.C_LINE_COMMENT_MODE,
                        r.C_BLOCK_COMMENT_MODE,
                        s,
                        d
                    ]
                }
            return {
                name: 'TypeScript',
                aliases: ['ts'],
                keywords: t,
                contains: [
                    r.SHEBANG(),
                    { className: 'meta', begin: /^\s*['"]use strict['"]/ },
                    r.APOS_STRING_MODE,
                    r.QUOTE_STRING_MODE,
                    c,
                    l,
                    E,
                    r.C_LINE_COMMENT_MODE,
                    r.C_BLOCK_COMMENT_MODE,
                    i,
                    {
                        begin:
                            '(' +
                            r.RE_STARTERS_RE +
                            '|\\b(case|return|throw)\\b)\\s*',
                        keywords: 'return throw case',
                        contains: [
                            r.C_LINE_COMMENT_MODE,
                            r.C_BLOCK_COMMENT_MODE,
                            r.REGEXP_MODE,
                            {
                                className: 'function',
                                begin:
                                    '(\\([^(]*(\\([^(]*(\\([^(]*\\))?\\))?\\)|' +
                                    r.UNDERSCORE_IDENT_RE +
                                    ')\\s*=>',
                                returnBegin: !0,
                                end: '\\s*=>',
                                contains: [
                                    {
                                        className: 'params',
                                        variants: [
                                            { begin: r.UNDERSCORE_IDENT_RE },
                                            {
                                                className: null,
                                                begin: /\(\s*\)/,
                                                skip: !0
                                            },
                                            {
                                                begin: /\(/,
                                                end: /\)/,
                                                excludeBegin: !0,
                                                excludeEnd: !0,
                                                keywords: t,
                                                contains: d.contains
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        relevance: 0
                    },
                    {
                        className: 'function',
                        beginKeywords: 'function',
                        end: /[\{;]/,
                        excludeEnd: !0,
                        keywords: t,
                        contains: [
                            'self',
                            r.inherit(r.TITLE_MODE, {
                                begin: '[A-Za-z$_][0-9A-Za-z$_]*'
                            }),
                            u
                        ],
                        illegal: /%/,
                        relevance: 0
                    },
                    {
                        beginKeywords: 'constructor',
                        end: /[\{;]/,
                        excludeEnd: !0,
                        contains: ['self', u]
                    },
                    {
                        begin: /module\./,
                        keywords: { built_in: 'module' },
                        relevance: 0
                    },
                    { beginKeywords: 'module', end: /\{/, excludeEnd: !0 },
                    {
                        beginKeywords: 'interface',
                        end: /\{/,
                        excludeEnd: !0,
                        keywords: 'interface extends'
                    },
                    { begin: /\$[(.]/ },
                    { begin: '\\.' + r.IDENT_RE, relevance: 0 },
                    s,
                    d
                ]
            }
        }
    })()
)
hljs.registerLanguage(
    'perl',
    (function () {
        'use strict'
        return function (e) {
            var n = {
                    $pattern: /[\w.]+/,
                    keyword:
                        'getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qq fileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent shutdown dump chomp connect getsockname die socketpair close flock exists index shmget sub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedir ioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when'
                },
                t = {
                    className: 'subst',
                    begin: '[$@]\\{',
                    end: '\\}',
                    keywords: n
                },
                s = { begin: '->{', end: '}' },
                r = {
                    variants: [
                        { begin: /\$\d/ },
                        {
                            begin: /[\$%@](\^\w\b|#\w+(::\w+)*|{\w+}|\w+(::\w*)*)/
                        },
                        { begin: /[\$%@][^\s\w{]/, relevance: 0 }
                    ]
                },
                i = [e.BACKSLASH_ESCAPE, t, r],
                a = [
                    r,
                    e.HASH_COMMENT_MODE,
                    e.COMMENT('^\\=\\w', '\\=cut', { endsWithParent: !0 }),
                    s,
                    {
                        className: 'string',
                        contains: i,
                        variants: [
                            {
                                begin: 'q[qwxr]?\\s*\\(',
                                end: '\\)',
                                relevance: 5
                            },
                            {
                                begin: 'q[qwxr]?\\s*\\[',
                                end: '\\]',
                                relevance: 5
                            },
                            {
                                begin: 'q[qwxr]?\\s*\\{',
                                end: '\\}',
                                relevance: 5
                            },
                            {
                                begin: 'q[qwxr]?\\s*\\|',
                                end: '\\|',
                                relevance: 5
                            },
                            {
                                begin: 'q[qwxr]?\\s*\\<',
                                end: '\\>',
                                relevance: 5
                            },
                            { begin: 'qw\\s+q', end: 'q', relevance: 5 },
                            {
                                begin: "'",
                                end: "'",
                                contains: [e.BACKSLASH_ESCAPE]
                            },
                            { begin: '"', end: '"' },
                            {
                                begin: '`',
                                end: '`',
                                contains: [e.BACKSLASH_ESCAPE]
                            },
                            { begin: '{\\w+}', contains: [], relevance: 0 },
                            {
                                begin: '-?\\w+\\s*\\=\\>',
                                contains: [],
                                relevance: 0
                            }
                        ]
                    },
                    {
                        className: 'number',
                        begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
                        relevance: 0
                    },
                    {
                        begin:
                            '(\\/\\/|' +
                            e.RE_STARTERS_RE +
                            '|\\b(split|return|print|reverse|grep)\\b)\\s*',
                        keywords: 'split return print reverse grep',
                        relevance: 0,
                        contains: [
                            e.HASH_COMMENT_MODE,
                            {
                                className: 'regexp',
                                begin: '(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*',
                                relevance: 10
                            },
                            {
                                className: 'regexp',
                                begin: '(m|qr)?/',
                                end: '/[a-z]*',
                                contains: [e.BACKSLASH_ESCAPE],
                                relevance: 0
                            }
                        ]
                    },
                    {
                        className: 'function',
                        beginKeywords: 'sub',
                        end: '(\\s*\\(.*?\\))?[;{]',
                        excludeEnd: !0,
                        relevance: 5,
                        contains: [e.TITLE_MODE]
                    },
                    { begin: '-\\w\\b', relevance: 0 },
                    {
                        begin: '^__DATA__$',
                        end: '^__END__$',
                        subLanguage: 'mojolicious',
                        contains: [
                            { begin: '^@@.*', end: '$', className: 'comment' }
                        ]
                    }
                ]
            return (
                (t.contains = a),
                (s.contains = a),
                {
                    name: 'Perl',
                    aliases: ['pl', 'pm'],
                    keywords: n,
                    contains: a
                }
            )
        }
    })()
)
hljs.registerLanguage(
    'xml',
    (function () {
        'use strict'
        return function (e) {
            var n = {
                    className: 'symbol',
                    begin: '&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;'
                },
                a = {
                    begin: '\\s',
                    contains: [
                        {
                            className: 'meta-keyword',
                            begin: '#?[a-z_][a-z1-9_-]+',
                            illegal: '\\n'
                        }
                    ]
                },
                s = e.inherit(a, { begin: '\\(', end: '\\)' }),
                t = e.inherit(e.APOS_STRING_MODE, { className: 'meta-string' }),
                i = e.inherit(e.QUOTE_STRING_MODE, {
                    className: 'meta-string'
                }),
                c = {
                    endsWithParent: !0,
                    illegal: /</,
                    relevance: 0,
                    contains: [
                        {
                            className: 'attr',
                            begin: '[A-Za-z0-9\\._:-]+',
                            relevance: 0
                        },
                        {
                            begin: /=\s*/,
                            relevance: 0,
                            contains: [
                                {
                                    className: 'string',
                                    endsParent: !0,
                                    variants: [
                                        { begin: /"/, end: /"/, contains: [n] },
                                        { begin: /'/, end: /'/, contains: [n] },
                                        { begin: /[^\s"'=<>`]+/ }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            return {
                name: 'HTML, XML',
                aliases: [
                    'html',
                    'xhtml',
                    'rss',
                    'atom',
                    'xjb',
                    'xsd',
                    'xsl',
                    'plist',
                    'wsf',
                    'svg'
                ],
                case_insensitive: !0,
                contains: [
                    {
                        className: 'meta',
                        begin: '<![a-z]',
                        end: '>',
                        relevance: 10,
                        contains: [
                            a,
                            i,
                            t,
                            s,
                            {
                                begin: '\\[',
                                end: '\\]',
                                contains: [
                                    {
                                        className: 'meta',
                                        begin: '<![a-z]',
                                        end: '>',
                                        contains: [a, s, i, t]
                                    }
                                ]
                            }
                        ]
                    },
                    e.COMMENT('\x3c!--', '--\x3e', { relevance: 10 }),
                    { begin: '<\\!\\[CDATA\\[', end: '\\]\\]>', relevance: 10 },
                    n,
                    {
                        className: 'meta',
                        begin: /<\?xml/,
                        end: /\?>/,
                        relevance: 10
                    },
                    {
                        className: 'tag',
                        begin: '<style(?=\\s|>)',
                        end: '>',
                        keywords: { name: 'style' },
                        contains: [c],
                        starts: {
                            end: '</style>',
                            returnEnd: !0,
                            subLanguage: ['css', 'xml']
                        }
                    },
                    {
                        className: 'tag',
                        begin: '<script(?=\\s|>)',
                        end: '>',
                        keywords: { name: 'script' },
                        contains: [c],
                        starts: {
                            end: '</script>',
                            returnEnd: !0,
                            subLanguage: ['javascript', 'handlebars', 'xml']
                        }
                    },
                    {
                        className: 'tag',
                        begin: '</?',
                        end: '/?>',
                        contains: [
                            {
                                className: 'name',
                                begin: /[^\/><\s]+/,
                                relevance: 0
                            },
                            c
                        ]
                    }
                ]
            }
        }
    })()
)
hljs.registerLanguage(
    'markdown',
    (function () {
        'use strict'
        return function (n) {
            const e = {
                    begin: '<',
                    end: '>',
                    subLanguage: 'xml',
                    relevance: 0
                },
                a = {
                    begin: '\\[.+?\\][\\(\\[].*?[\\)\\]]',
                    returnBegin: !0,
                    contains: [
                        {
                            className: 'string',
                            begin: '\\[',
                            end: '\\]',
                            excludeBegin: !0,
                            returnEnd: !0,
                            relevance: 0
                        },
                        {
                            className: 'link',
                            begin: '\\]\\(',
                            end: '\\)',
                            excludeBegin: !0,
                            excludeEnd: !0
                        },
                        {
                            className: 'symbol',
                            begin: '\\]\\[',
                            end: '\\]',
                            excludeBegin: !0,
                            excludeEnd: !0
                        }
                    ],
                    relevance: 10
                },
                i = {
                    className: 'strong',
                    contains: [],
                    variants: [
                        { begin: /_{2}/, end: /_{2}/ },
                        { begin: /\*{2}/, end: /\*{2}/ }
                    ]
                },
                s = {
                    className: 'emphasis',
                    contains: [],
                    variants: [
                        { begin: /\*(?!\*)/, end: /\*/ },
                        { begin: /_(?!_)/, end: /_/, relevance: 0 }
                    ]
                }
            i.contains.push(s), s.contains.push(i)
            var c = [e, a]
            return (
                (i.contains = i.contains.concat(c)),
                (s.contains = s.contains.concat(c)),
                {
                    name: 'Markdown',
                    aliases: ['md', 'mkdown', 'mkd'],
                    contains: [
                        {
                            className: 'section',
                            variants: [
                                {
                                    begin: '^#{1,6}',
                                    end: '$',
                                    contains: (c = c.concat(i, s))
                                },
                                {
                                    begin: '(?=^.+?\\n[=-]{2,}$)',
                                    contains: [
                                        { begin: '^[=-]*$' },
                                        { begin: '^', end: '\\n', contains: c }
                                    ]
                                }
                            ]
                        },
                        e,
                        {
                            className: 'bullet',
                            begin: '^[ \t]*([*+-]|(\\d+\\.))(?=\\s+)',
                            end: '\\s+',
                            excludeEnd: !0
                        },
                        i,
                        s,
                        {
                            className: 'quote',
                            begin: '^>\\s+',
                            contains: c,
                            end: '$'
                        },
                        {
                            className: 'code',
                            variants: [
                                { begin: '(`{3,})(.|\\n)*?\\1`*[ ]*' },
                                { begin: '(~{3,})(.|\\n)*?\\1~*[ ]*' },
                                { begin: '```', end: '```+[ ]*$' },
                                { begin: '~~~', end: '~~~+[ ]*$' },
                                { begin: '`.+?`' },
                                {
                                    begin: '(?=^( {4}|\\t))',
                                    contains: [
                                        { begin: '^( {4}|\\t)', end: '(\\n)$' }
                                    ],
                                    relevance: 0
                                }
                            ]
                        },
                        { begin: '^[-\\*]{3,}', end: '$' },
                        a,
                        {
                            begin: /^\[[^\n]+\]:/,
                            returnBegin: !0,
                            contains: [
                                {
                                    className: 'symbol',
                                    begin: /\[/,
                                    end: /\]/,
                                    excludeBegin: !0,
                                    excludeEnd: !0
                                },
                                {
                                    className: 'link',
                                    begin: /:\s*/,
                                    end: /$/,
                                    excludeBegin: !0
                                }
                            ]
                        }
                    ]
                }
            )
        }
    })()
)
hljs.registerLanguage(
    'ruby',
    (function () {
        'use strict'
        return function (e) {
            var n =
                    '[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?',
                a = {
                    keyword:
                        'and then defined module in return redo if BEGIN retry end for self when next until do begin unless END rescue else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor',
                    literal: 'true false nil'
                },
                s = { className: 'doctag', begin: '@[A-Za-z]+' },
                i = { begin: '#<', end: '>' },
                r = [
                    e.COMMENT('#', '$', { contains: [s] }),
                    e.COMMENT('^\\=begin', '^\\=end', {
                        contains: [s],
                        relevance: 10
                    }),
                    e.COMMENT('^__END__', '\\n$')
                ],
                c = {
                    className: 'subst',
                    begin: '#\\{',
                    end: '}',
                    keywords: a
                },
                t = {
                    className: 'string',
                    contains: [e.BACKSLASH_ESCAPE, c],
                    variants: [
                        { begin: /'/, end: /'/ },
                        { begin: /"/, end: /"/ },
                        { begin: /`/, end: /`/ },
                        { begin: '%[qQwWx]?\\(', end: '\\)' },
                        { begin: '%[qQwWx]?\\[', end: '\\]' },
                        { begin: '%[qQwWx]?{', end: '}' },
                        { begin: '%[qQwWx]?<', end: '>' },
                        { begin: '%[qQwWx]?/', end: '/' },
                        { begin: '%[qQwWx]?%', end: '%' },
                        { begin: '%[qQwWx]?-', end: '-' },
                        { begin: '%[qQwWx]?\\|', end: '\\|' },
                        {
                            begin: /\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/
                        },
                        {
                            begin: /<<[-~]?'?(\w+)(?:.|\n)*?\n\s*\1\b/,
                            returnBegin: !0,
                            contains: [
                                { begin: /<<[-~]?'?/ },
                                e.END_SAME_AS_BEGIN({
                                    begin: /(\w+)/,
                                    end: /(\w+)/,
                                    contains: [e.BACKSLASH_ESCAPE, c]
                                })
                            ]
                        }
                    ]
                },
                b = {
                    className: 'params',
                    begin: '\\(',
                    end: '\\)',
                    endsParent: !0,
                    keywords: a
                },
                d = [
                    t,
                    i,
                    {
                        className: 'class',
                        beginKeywords: 'class module',
                        end: '$|;',
                        illegal: /=/,
                        contains: [
                            e.inherit(e.TITLE_MODE, {
                                begin: '[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?'
                            }),
                            {
                                begin: '<\\s*',
                                contains: [
                                    {
                                        begin:
                                            '(' +
                                            e.IDENT_RE +
                                            '::)?' +
                                            e.IDENT_RE
                                    }
                                ]
                            }
                        ].concat(r)
                    },
                    {
                        className: 'function',
                        beginKeywords: 'def',
                        end: '$|;',
                        contains: [
                            e.inherit(e.TITLE_MODE, { begin: n }),
                            b
                        ].concat(r)
                    },
                    { begin: e.IDENT_RE + '::' },
                    {
                        className: 'symbol',
                        begin: e.UNDERSCORE_IDENT_RE + '(\\!|\\?)?:',
                        relevance: 0
                    },
                    {
                        className: 'symbol',
                        begin: ':(?!\\s)',
                        contains: [t, { begin: n }],
                        relevance: 0
                    },
                    {
                        className: 'number',
                        begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
                        relevance: 0
                    },
                    { begin: '(\\$\\W)|((\\$|\\@\\@?)(\\w+))' },
                    {
                        className: 'params',
                        begin: /\|/,
                        end: /\|/,
                        keywords: a
                    },
                    {
                        begin: '(' + e.RE_STARTERS_RE + '|unless)\\s*',
                        keywords: 'unless',
                        contains: [
                            i,
                            {
                                className: 'regexp',
                                contains: [e.BACKSLASH_ESCAPE, c],
                                illegal: /\n/,
                                variants: [
                                    { begin: '/', end: '/[a-z]*' },
                                    { begin: '%r{', end: '}[a-z]*' },
                                    { begin: '%r\\(', end: '\\)[a-z]*' },
                                    { begin: '%r!', end: '![a-z]*' },
                                    { begin: '%r\\[', end: '\\][a-z]*' }
                                ]
                            }
                        ].concat(r),
                        relevance: 0
                    }
                ].concat(r)
            ;(c.contains = d), (b.contains = d)
            var g = [
                { begin: /^\s*=>/, starts: { end: '$', contains: d } },
                {
                    className: 'meta',
                    begin: '^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+>|(\\w+-)?\\d+\\.\\d+\\.\\d(p\\d+)?[^>]+>)',
                    starts: { end: '$', contains: d }
                }
            ]
            return {
                name: 'Ruby',
                aliases: ['rb', 'gemspec', 'podspec', 'thor', 'irb'],
                keywords: a,
                illegal: /\/\*/,
                contains: r.concat(g).concat(d)
            }
        }
    })()
)
