#
# Copyright 2025 OpenWRT contributors
# Licensed to the public under the Apache License 2.0.
#
# Compatible with OpenWRT 25.12+ (APK) and 24.10 (IPK)
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=Nova — Modern glassmorphism LuCI theme with dark/light mode (v1.0.0)
LUCI_DEPENDS:=+luci-base

PKG_NAME:=luci-theme-nova
PKG_VERSION:=1.0.0
PKG_RELEASE:=1

PKG_MAINTAINER:=wzhali <wzhali@users.noreply.github.com>
PKG_LICENSE:=Apache-2.0

define Package/luci-theme-nova/prerm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	current="$$(uci -q get luci.main.mediaurl)"
	if [ "$${current}" = "/luci-static/nova" ]; then
		uci -q set luci.main.mediaurl=/luci-static/bootstrap
		uci commit luci
	fi
}
endef

define Package/luci-theme-nova/postrm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	uci -q delete luci.themes.Nova
	uci commit luci
}
endef

# Install paths (LuCI 25.12+):
#   CSS/JS:  /www/luci-static/nova/
#   Templates: /usr/share/ucode/luci/template/themes/nova/
include ../../luci.mk

# call BuildPackage - OpenWRT buildroot signature
