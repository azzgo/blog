# Alberta_fork

一个基于台湾同胞的hexo主题[Alberta](https://github.com/ken8203/hexo-theme-alberta.git)的个人fork修改版本

- [Preview](http://www.azzfun.net/)

## Installation

### 安装

``` bash
$ git clone https://github.com/vinongo/hexo-theme-alberta.git
themes/alberta
```

### 启用主题

更改hexo创建目录下的`_config.yml`文件中的`theme` 值为`alberta`.

## 配置

``` yml
# Header
menu:
  Home: /
  Archives: /archives
  About: /about
rss: /atom.xml

# Menu Icon
menu_icon:
  Home: fa-home
  Archives: fa-archive
  About: fa-user

# Content
excerpt_link: Read More
fancybox: true

# Personal Image
your_img: your_image_url

# Miscellaneous
google_analytics:
favicon: favicon.ico
twitter:
google_plus:
```

- **your_img** - Your own photo url, suggest putting a squarelike photo. (equal to or bigger than 150x150)
- **menu** - Navigation menu, you need to `hexo new page 'about'` for the about page.
- **menu_icon** - Navigation icon
- **rss** - RSS link
- **excerpt_link** - "Read More" link at the bottom of excerpted articles. `false` to hide the 
- **google_analytics** - Google Analytics ID
- **favicon** - Favicon path
- **twitter** - Twiiter ID
