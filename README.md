# 图片瀑布流

本文目标意在实现横向和纵向图片瀑布流；横向采用 `Flex布局`，纵向则提供`Absolute绝对定位` 和` Grid布局` 两种解决方案；数据上采用真实的接口请求，图片为爬虫爬取后存库；优化上做了懒加载和防抖，减少资源消耗的同时增强用户体验。

**演示网址：**

[纵向瀑布流 - 演示网址](https://waterfall.deeruby.com)

[横向瀑布流 - 演示网址](https://waterfall.deeruby.com?type=HORIZONTAL)

**效果图：**

tips：图片为爬虫爬取【 来源为 [wallhaven.cc](https://wallhaven.cc/) 】，过滤大小为200K，实际工作中可存取不同规格的图片，瀑布流时展示小图，预览在加载高清大图。

![waterfall.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d29d1efb4d9642199e0661078a095c40~tplv-k3u1fbpfcp-watermark.image?)

**启动：**

前端：`yarn start`

服务端：`node src/bin/www.js`（数据库读取的.env文件，大家可自行模拟接口）
