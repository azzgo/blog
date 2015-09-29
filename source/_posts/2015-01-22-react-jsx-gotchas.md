title: jsx-gotchas
date: 2015-01-22 07:57:44
categories:
- 文档翻译
tags:
- react
- react 指南
---



JSX 看起来像是HTML 但是这里还是有几点不同.

> Note:
>
> 对于 DOM的不同, 比如内嵌的 `style` 属性, 相关查看[这里](/react/docs/dom-differences.html).

<!--more-->

## HTML 实体

你可以使用文字字面量在 JSX 中插入 HTML 实体:
You can insert HTML entities within literal text in JSX:

```javascript
<div>First &middot; Second</div>
```

如果你想在 HTML 实体中显示动态内容的话, 你会陷入双重转义的问题, 因为 React 默认为了防止广泛的 XSS 攻击, 会转义所有字符串.

```javascript
// Bad: It displays "First &middot; Second"
<div>{'First &middot; Second'}</div>
```

这里有多种解决方案. 最简单的一个就是直接在 Javascript 中书写 Unicode 字符. 你需要确保文件保存为 UTF-8 编码, 以便浏览器能够正确显示出来.

```javascript
<div>{'First · Second'}</div>
```

一个更安全的替代方案是找到关于这个实体的相关 [Unicode 编号](http://www.fileformat.info/info/unicode/char/b7/index.htm), 然后再 Javascript 字符串中使用它.

```javascript
<div>{'First \u00b7 Second'}</div>
<div>{'First ' + String.fromCharCode(183) + ' Second'}</div>
```

你可以使用混用字符串和 JSX 元素的数组.

```javascript
<div>{['First ', <span>&middot;</span>, ' Second']}</div>
```

最后一招, 你永远有能力嵌入原生的 HTML.

```javascript
<div dangerouslySetInnerHTML={{__html: 'First &middot; Second'}} />
```


## 自定义 HTML 属性

如果你传入在原生 HTML 元素中没有的属性, React 将不会呈现他们. 如果你想使用自定义的属性, 你应该在前面添加 `data-` 的前缀.

```javascript
<div data-custom-attribute="foo" />
```

[Web 可访问性](http://www.w3.org/WAI/intro/aria)属性以 `aria-` 开头, 将会作为属性被呈现.

```javascript
<div aria-hidden={true} />
```
