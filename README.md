# luci-theme-nova

OpenWRT 25.12+ LuCI 主题 — 玻璃态 · 动态极光渐变 · 深色/浅色模式 · 中文优化

## 特性

- **玻璃态设计** — `backdrop-filter: blur()` 毛玻璃表面，通透质感
- **动态极光背景** — 青蓝紫绿四色径向渐变 + 缓慢漂移动画
- **深色/浅色双模式** — 跟随系统 `prefers-color-scheme` + 侧栏右上角手动切换
- **侧边栏导航** — 240px 固定宽度，移动端自动折叠
- **中文优先** — 字体栈优先 `PingFang SC` / `Noto Sans SC`
- **响应式** — 768px 断点以下自动适配移动端
- **零外部依赖** — 仅 CSS + 原生 JavaScript，无第三方库

## 结构

```
luci-theme-nova/
├── Makefile                              # 编译打包
├── htdocs/luci-static/nova/
│   ├── css/cascade.css                   # 主样式表
│   ├── js/main.js                        # 主题 JS（深色切换、侧栏折叠）
│   ├── logo.svg                          # 新星 Logo
│   └── spinner.svg                       # 加载动画
├── htdocs/luci-static/resources/
│   └── menu-nova.js                      # 菜单渲染
├── ucode/template/themes/nova/
│   ├── header.ut                         # 头部模板
│   └── footer.ut                         # 页脚模板
└── root/etc/uci-defaults/
    └── luci-theme-nova                   # 安装注册脚本
```

## 编译

### OpenWRT SDK（推荐）

```bash
# 将主题放入 feeds 或 package 目录
cd openwrt
./scripts/feeds install luci-theme-nova
make package/luci-theme-nova/compile
```

输出 `.apk`（25.12+）或 `.ipk`（24.10），取决于 SDK 版本。

### 手动部署

```bash
# 复制静态资源
scp -r htdocs/luci-static/nova root@192.168.1.1:/www/luci-static/

# 复制模板
ssh root@192.168.1.1 "mkdir -p /usr/share/luci/ucode/template/themes/nova"
scp ucode/template/themes/nova/* root@192.168.1.1:/usr/share/luci/ucode/template/themes/nova/

# 切换主题
ssh root@192.168.1.1 "uci set luci.main.mediaurl=/luci-static/nova && uci commit luci"
```

## 切换主题

```bash
uci set luci.main.mediaurl=/luci-static/nova && uci commit luci
```

或在 LuCI Web 界面 → System → System → Language and Style → Design Theme 中选择 "Nova"。

## 许可证

Apache-2.0
