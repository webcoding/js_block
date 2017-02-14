
source: https://linux.cn/article-5808-1.html

# Referrer Policy 介绍

我们知道，在页面引入图片、JS 等资源，或者从一个页面跳到另一个页面，都会产生新的 HTTP 请求，浏览器一般都会给这些请求头加上表示来源的 Referrer 字段。Referrer 在分析用户来源时很有用，有着广泛的使用。但 URL 可能包含用户敏感信息，如果被第三方网站拿到很不安全（例如之前不少 Wap 站把用户 SESSION ID 放在 URL 中传递，第三方拿到 URL 就可以看到别人登录后的页面）。之前浏览器会按自己的默认规则来决定是否加上 Referrer。

2014 年，W3C 的 Web 应用安全工作组（Web Application Security Working Group）发布了 [Referrer Policy](http://w3c.github.io/webappsec/specs/referrer-policy/) 草案，对浏览器该如何发送 Referrer 做了详细的规定。新版 Chrome 已经支持了这份草案，我们终于可以灵活地控制自己网站的 Referrer 策略了。

通过新的 Referrer Policy，我们可以针对第三方网站隐藏 Referrer，也可以只发送来源 URL 的 host 部分。但有一点要记住，新策略允许沉默，但不允许说谎。换句话说，你有权不告诉对方请求从哪儿来，但是不允许用假来源去骗人。不过即便是这样，这也对现有一些 Web 应用程序的安全性造成威胁。不少 Web 应用在限制 Referrer 时允许为空，之前想要发送无 Referrer 请求还要一点点技巧，现在就轻而易举了。

## Referrer Policy States

新的 Referrer Policy 规定了五种 Referrer 策略：No Referrer、No Referrer When Downgrade、Origin Only、Origin When Cross-origin、和 Unsafe URL。之前就存在的三种策略：never、default 和 always，在新标准里换了个名称。他们的对应关系如下：

策略名称 | 属性值（新） | 属性值（旧）
-------------------------------
No Referrer | no-referrer | never
No Referrer When Downgrade | no-referrer-when-downgrade | default
Origin Only | origin | -
Origin When Cross-origin | origin-when-crossorigin | -
Unsafe URL | unsafe-url | always

可以看到，新标准给之前的三种策略赋予了更具意义的新名称，同时还增加了两种新策略。另外现阶段支持 Referrer Policy 的浏览器保留了对旧标准的支持，但还是推荐大家尽快更新。简单介绍下这五种类型的具体含义：

- No Referrer：任何情况下都不发送 Referrer 信息；
- No Referrer When Downgrade：仅当发生协议降级（如 HTTPS 页面引入 HTTP 资源，从 HTTPS 页面跳到 HTTP 等）时不发送 Referrer 信息。这个规则是现在大部分浏览器默认所采用的；
- Origin Only：发送只包含 host 部分的 Referrer。启用这个规则，无论是否发生协议降级，无论是本站链接还是站外链接，都会发送 Referrer 信息，但是只包含协议 + host 部分（不包含具体的路径及参数等信息）；
- Origin When Cross-origin：仅在发生跨域访问时发送只包含 host 的 Referrer，同域下还是完整的。它与 `Origin Only` 的区别是多判断了是否 `Cross-origin`。需要注意的是协议、域名和端口都一致，才会被浏览器认为是同域；
- Unsafe URL：无论是否发生协议降级，无论是本站链接还是站外链接，统统都发送 Referrer 信息。正如其名，这是最宽松而最不安全的策略；

## Referrer Policy Delivery

知道了有哪些策略可以用，还需要了解怎么用。这里介绍指定 Referrer Policy 的三种方式：

## CSP 响应头

CSP（Content Security Policy），是一个跟页面内容安全有关的规范。在 HTTP 中通过响应头中的 `Content-Security-Policy` 字段来告诉浏览器当前页面要使用何种 CSP 策略。我之前写过一篇 [Content Security Policy 介绍](https://imququ.com/post/content-security-policy-reference.html)，可以先看看。现在 CSP 还可以通过 `referrer` 指令和五种可选的指令值，来指定 Referrer 策略，格式非常简单：

```
Content-Security-Policy: referrer no-referrer|no-referrer-when-downgrade|origin|origin-when-cross-origin|unsafe-url;
```

注：根据[文档](http://w3c.github.io/webappsec/specs/referrer-policy/#directive-referrer)，通过 CSP 头部设置 Origin When Cross-origin 策略时，指令值应该用 `origin-when-cross-origin`，这跟前面的表格里的 `origin-when-crossorigin` 有差异。实际上经过我的测试，Chrome 42 只支持 `origin-when-crossorigin`，后续会不会变还不知道，建议大家使用时，自己先测一下。

CSP 的指令和指令值之间以空格分割，多个指令之间用英文分号分割。

## `<meta>` 标签

通过 `<meta>` 标签也可以指定 Referrer 策略，同样很简单：

```
<meta name="referrer" content="no-referrer|no-referrer-when-downgrade|origin|origin-when-crossorigin|unsafe-url">
```

需要注意的是，<meta> 只能放在 <head>...</head> 之间，如果出现的位置不对会被忽略。同样，如果没有给它定义 content 属性，或者 content 属性为空，也会被忽略。如果 content 属性不是合法的取值，浏览器会自动选择 no-referrer 这种最严格的策略。

## <a> 标签的 referrer 属性

通过给 `<a>` 标签增加 `referrer` 属性也可以指定 Referrer 策略，格式如下：

```<a href="http://example.com" referrer="no-referrer|origin|unsafe-url">xxx</a>```

这种方式作用的只是这一个链接。并且，`<a>` 标签可用的 Referrer 策略只有三种：不传、只传 host 和都传。另外，这样针对单个链接设置的策略优先级比 CSP 和 `<meta>` 要高。

需要注意的是：经过我的测试，目前并没有哪个浏览器实现了对 `referrer` 属性的支持。现阶段，如果要针对单个链接去掉 Referrer，还是推荐使用下面这种支持度更好的写法（[详情](https://html.spec.whatwg.org/multipage/semantics.html#link-type-noreferrer)）：

```<a href="http://example.com" rel="noreferrer">xxx</a>```

另外再重复一遍，现阶段的浏览器还保留了对 never、default 和 always 的支持，但是已经不推荐使用了。
可以看到，通过新的 Referrer 策略，网站所有者可以选择更高的安全级别来保证用户隐私不被泄露；也可以选择更低的安全级别来获得一些便利，相比之前只能由浏览器默认策略一刀切，确实灵活了不少。

## 更新说明

本文写完后，Origin When Cross-origin 策略的指令值有所变化，[详情请点击查看](https://imququ.com/post/referrer-policy-2.html)。

本文链接：https://imququ.com/post/referrer-policy.html，参与评论 »
--EOF--
