
#关于防注入广告的研究

起源：我们的网站在部分网络里，被注入广告了，这让人很恼火，因为还有些广告是黄色广告，这会影响我们的品牌形象，当然据说 https 可以解决这个问题，但是，先不说是否真的OK，这个方案有个问题就是，需要购买 https 证书，是要有开销的

于是乎，我就想，既然被注入广告，肯定是有模式可以操作的，期初，想法比较简单，先发现注入的形式，比如注入的 html广告代码，可以通过JS来检索并移除，但没有重现被注入的广告页面（只碰到一两次，且是手机端，没找到注入代码的模式）；另一个角度，思考被注入的是一段 js，此处经测试，一旦注入 script 标签，并 src 设置值后，就会去加载，加载过程及加载后，无法中断，即使我的 js 先运行，也不行，无法阻止其加载。细想这应该是浏览器应该支持的功能，让我能设置允许执行的 js 种类。但我不知道通过什么来控制...

最好，我想这应该交给 w3c 来实现支持这种需求，因为开放网络越来越多了，被注入显然是个问题，而且这个问题很早就存在了，没准已经有解决方案了

于是，我向 w3c 描述了下我想解决网站被注入广告的问题，并提到类似资源授权域的想法，并咨询，是否已经有方案但我不知道。他们效率很高，不久就给我答复了，非常完美，就是我期望的解决方式——内容安全策略（CSP），其本质就是解决我这种类似的问题，这让我很高兴，非常感谢 w3c 成员给予的指导，立马来测试，发现真正解决这种问题，思考与要解决的东西还是很多的，w3c 组织所做所考虑的，真的很完善。

相关资料参看：

- https://developer.mozilla.org/zh-CN/docs/Web/Security/CSP/Using_Content_Security_Policy
- http://content-security-policy.com/
- http://www.chinaw3c.org/archives/396/
- https://www.w3.org/TR/2015/CR-CSP2-20150721/ csp2 已经被支持
- http://www.chinaw3c.org/archives/1242/ csp3正在进行时 https://www.w3.org/TR/CSP3/
- https://w3c.github.io/webappsec-csp/
- https://www.w3.org/TR/2016/WD-CSP3-20160126/


如何设置：

参看：http://www.weixinla.com/document/20635893.html
示例：https://webcoding.github.io/js_block/block_res/content/test2.html

```
关于防止广告注入（内容安全策略CSP），可以设置 HEADER 头开启
res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' *.iqianggou.com hm.baidu.com *.baidustatic.com pos.baidu.com dn-growing.qbox.me data: api.growingio.com;font-src at.alicdn.com;");

也可以在 html 文档中设置 meta 属性开启（不必依赖服务端来设置了）
<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' *.iqianggou.com hm.baidu.com *.baidustatic.com pos.baidu.com dn-growing.qbox.me data: api.growingio.com;font-src at.alicdn.com;">
```

## 问题

**注意，此问题并不影响以上的研究使用，此问题是——浏览器默认不允许在 https 里面引用 http 资源的，会被直接 block 掉的。这是此问题的本质**


发现本地如上设置预览是 OK 的，发布 github 后预览就不 OK 了，需要解决下，初步猜测可能和 github 用的 https 协议有关

此处使用 https 的 github，会要求加载资源也必须用 https，于是乎就出问题了，针对 https 改造站点，难免会引用 http 的资源

W3C 工作组考虑到了升级 HTTPS 的艰难，在 2015 年 4 月份就出了一个 Upgrade Insecure Requests 的草案 http://www.w3.org/TR/mixed-content/，他的作用就是让浏览器自动升级请求。页面一旦发现存在该响应头，会在加载 http 资源时自动替换成 https 请求。如下设置

```
// 建议通过服务器 add header 来设置，这样测试环境不必转化为 https 资源支持，特别是用于本地调试
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
```

目前支持这个设置的还只有 chrome 43.0，另外此设置**不会对外域的 a 链接做处理**，w3c 也有提供一个示例 http://www.w3.org/TR/upgrade-insecure-requests/#examples

原本在安全级别上，https 站点加载 http图片资源不应该被 blocked，但现在出现了这种情况，

**注：** https 目前在 IOS 10.2.1 的 Safari、Wechat、QQ 上测试到存在网页 https 加载 http 的图片资源时，第一次被 blocked 了(可稳定重现)，刷新后或重新进入就好了（有一台机器微信内怎么刷新都不好），查资料目前没有明确的说法会 blocked 掉 http 的图片资源。但经过测试，加载 https 的图片资源没有问题。可以通过以上 `upgrade-insecure-requests` 设置解决问题（全站设定）

排查问题查询了部分资料如下：

- https://support.apple.com/en-us/HT205265
- https://blog.qualys.com/ssllabs/2014/03/19/https-mixed-content-still-the-easiest-way-to-break-ssl
- https://developer.mozilla.org/zh-CN/docs/Security/MixedContent
- https://www.w3.org/TR/upgrade-insecure-requests/#examples
- https://www.w3.org/TR/upgrade-insecure-requests/#upgrade-request
- https://www.w3.org/TR/mixed-content/
- [关于启用 HTTPS 的一些经验分享（一）](https://imququ.com/post/sth-about-switch-to-https.html)
- [关于启用 HTTPS 的一些经验分享（二）](https://imququ.com/post/sth-about-switch-to-https-2.html)
- [关于启用 HTTPS 的一些经验分享（三）](https://imququ.com/post/sth-about-switch-to-https-3.html)
- [诡异问题排查之「DataURI 引发的血案」](https://imququ.com/post/datauri-and-404.html)
- [利用图片传输数据的另类思路](https://imququ.com/post/use-image-to-transfer-data.html)
- [让浏览器不再显示 https 页面中的 http 请求警报](http://www.cnblogs.com/hustskyking/archive/2015/08/21/upgrade-insecure-requests.html)
- https://bugzilla.mozilla.org/show_bug.cgi?id=1302695

以下为 github 上的设置：

```
Content-Security-Policy:default-src 'none'; base-uri 'self'; block-all-mixed-content; child-src render.githubusercontent.com; connect-src 'self' uploads.github.com status.github.com collector.githubapp.com api.github.com www.google-analytics.com github-cloud.s3.amazonaws.com wss://live.github.com; font-src assets-cdn.github.com; form-action 'self' github.com gist.github.com; frame-ancestors 'none'; img-src 'self' data: assets-cdn.github.com identicons.github.com collector.githubapp.com github-cloud.s3.amazonaws.com *.githubusercontent.com; media-src 'none'; script-src assets-cdn.github.com; style-src 'unsafe-inline' assets-cdn.github.com
```

#### 但是我们的http 资源没有对应的 https 资源，自动替换了也无解，怎么办

这个问题已经变了性质，变成了**如何在 https 页面中引入 http 资源？**

目前，浏览器默认是不允许在 https 里面引用 http 资源的，会被直接 block 掉的。这就是我们当前碰到的问题

这就是安全设定问题了，没法解决了，请本地开个服务用 http 协议浏览吧

**tips:**

chrome 有个参数，可以让 https 页面加载 http 资源(更多参数参看：https://www.douban.com/note/193710154/)

```
//我测试了，但不好用 目前仍然无解
chrome.exe --allow-running-insecure-content
```
