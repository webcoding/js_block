
#关于防注入广告的研究

起源：我们的网站在部分网络里，被注入广告了，这让人很恼火，因为还有些广告是黄色广告，这会影响我们的品牌形象，当然据说 https 可以解决这个问题，但是，先不说是否真的OK，这个方案有个问题就是，需要购买 https 证书，是要有开销的

于是乎，我就想，既然被注入广告，肯定是有模式可以操作的，期初，想法比较简单，先发现注入的形式，比如注入的 html广告代码，可以通过JS来检索并移除，但没有重现被注入的广告页面（只碰到一两次，且是手机端，没找到注入代码的模式）；另一个角度，思考被注入的是一段 js，此处经测试，一旦注入 script 标签，并 src 设置值后，就会去加载，加载过程及加载后，无法中断，即使我的 js 先运行，也不行，无法阻止其加载。细想这应该是浏览器应该支持的功能，让我能设置允许执行的 js 种类。但我不知道通过什么来控制...

最好，我想这应该交给 w3c 来实现支持这种需求，因为开放网络越来越多了，被注入显然是个问题，而且这个问题很早就存在了，没准已经有解决方案了

于是，我向 w3c 描述了下我想解决网站被注入广告的问题，并提到类似资源授权域的想法，并咨询，是否已经有方案但我不知道。他们效率很高，不久就给我答复了，非常完美，就是我期望的解决方式——内容安全策略（CSP），很高兴，立马来测试，发现真正解决这种问题，思考的东西还是很多的。

相关资料参看：

- https://developer.mozilla.org/zh-CN/docs/Web/Security/CSP/Using_Content_Security_Policy
- http://content-security-policy.com/
- http://www.chinaw3c.org/archives/396/
- https://www.w3.org/TR/2015/CR-CSP2-20150721/ csp2 已经被支持
- http://www.chinaw3c.org/archives/1242/ csp3正在进行时
- https://w3c.github.io/webappsec-csp/
- https://www.w3.org/TR/2016/WD-CSP3-20160126/
- https://www.w3.org/Security/


如何设置：

参看：http://www.weixinla.com/document/20635893.html
示例：https://webcoding.github.io/js_block/block_res/content/test2.html

发现本地设置预览是 OK 的，发布 github 后预览就不 OK 了，解决下

```


关于防止广告注入（内容安全策略CSP），可以设置 HEADER 头开启
res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' *.iqianggou.com hm.baidu.com *.baidustatic.com pos.baidu.com dn-growing.qbox.me data: api.growingio.com;font-src at.alicdn.com;");

也可以在 html 文档中设置 meta 属性开启（不必依赖服务端来设置了）
<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' *.iqianggou.com hm.baidu.com *.baidustatic.com pos.baidu.com dn-growing.qbox.me data: api.growingio.com;font-src at.alicdn.com;">
```
