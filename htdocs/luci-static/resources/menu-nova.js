'use strict';
'require baseclass';
'require ui';

return baseclass.extend({
	__init__() {
		ui.menu.load().then((tree) => this.render(tree));
	},

	render(tree) {
		var node = tree;
		var url = '';

		this.renderModeMenu(tree);

		var dp = (L.env && L.env.dispatchpath) ? L.env.dispatchpath : [];
		if (dp.length >= 3) {
			for (var i = 0; i < 3 && node; i++) {
				node = node.children[dp[i]];
				url = url + (url ? '/' : '') + dp[i];
			}

			if (node)
				this.renderTabMenu(node, url);
		}
	},

	renderModeMenu(tree) {
		var menu = document.querySelector('#modemenu');
		if (!menu) return;

		var children = ui.menu.getChildren(tree);
		if (!children || !children.length) return;

		var rp = (L.env && L.env.requestpath) ? L.env.requestpath : [];

		children.forEach(function(child, index) {
			var isActive = rp.length
				? child.name === rp[0]
				: index === 0;

			var li = E('li', { 'class': isActive ? 'active' : '' }, [
				E('a', { 'href': L.url(child.name) }, [ this._t(child.title) ])
			]);
			menu.appendChild(li);

			if (isActive) {
				var sub = this.renderMainMenu(child, child.name);
				if (sub) li.appendChild(sub);
			}
		}, this);

		// show menu even with a single top-level item
		if (menu.children.length >= 1)
			menu.style.display = '';
	},

	renderMainMenu(tree, url, level) {
		var l = (level || 0) + 1;
		var children = ui.menu.getChildren(tree);

		if (!children || children.length === 0 || l > 2)
			return null;

		var ul = E('ul', { 'class': 'l%d'.format(l) });

		children.forEach(function(child) {
			var dp = (L.env && L.env.dispatchpath) ? L.env.dispatchpath : [];
			var isActive = (dp[l] == child.name);
			var sub = this.renderMainMenu(child, url + '/' + child.name, l);
			var children_elements = [ E('a', { 'href': L.url(url + '/' + child.name) }, [ this._t(child.title) ]) ];
			if (sub) children_elements.push(sub);
			ul.appendChild(E('li', { 'class': isActive ? 'active' : '' }, children_elements));
		}, this);

		return ul;
	},

	renderTabMenu(tree, url, level) {
		var container = document.querySelector('#tabmenu');
		if (!container) return;

		var l = (level || 0) + 1;
		var ul = E('ul', { 'class': 'cbi-tabmenu' });
		var children = ui.menu.getChildren(tree);
		var activeNode = null;

		if (!children || children.length === 0)
			return;

		var dp = (L.env && L.env.dispatchpath) ? L.env.dispatchpath : [];

		children.forEach(function(child) {
			var isActive = (dp[l + 2] == child.name);
			var activeClass = isActive ? ' cbi-tab' : '';

			ul.appendChild(E('li', {
				'class': 'tabmenu-item-%s%s'.format(child.name, activeClass)
			}, [
				E('a', { 'href': L.url(url, child.name) }, [ this._t(child.title) ])
			]));

			if (isActive)
				activeNode = child;
		}, this);

		container.appendChild(ul);
		container.style.display = '';

		if (activeNode)
			container.appendChild(this.renderTabMenu(activeNode, url + '/' + activeNode.name, l));
	},

	// Translation wrapper with Chinese fallback for common LuCI menu items
	_t: function(key) {
		var translated = _(key);
		// If translation returns the key itself (untranslated), try our zh-cn fallback
		if (translated === key && this._zh[key])
			return this._zh[key];
		return translated;
	},

	_zh: {
		'Status':    '\u72b6\u6001',
		'System':    '\u7cfb\u7edf',
		'Services':  '\u670d\u52a1',
		'Network':   '\u7f51\u7edc',
		'Logout':    '\u9000\u51fa',
		'Overview':  '\u6982\u89c8',
		'Routes':    '\u8def\u7531',
		'System Log': '\u7cfb\u7edf\u65e5\u5fd7',
		'Kernel Log': '\u5185\u6838\u65e5\u5fd7',
		'Processes':  '\u8fdb\u7a0b',
		'Administration': '\u7ba1\u7406',
		'Software':   '\u8f6f\u4ef6',
		'Startup':    '\u542f\u52a8',
		'Scheduled Tasks': '\u8ba1\u5212\u4efb\u52a1',
		'Mount Points': '\u6302\u8f7d\u70b9',
		'Backup / Flash Firmware': '\u5907\u4efd/\u5347\u7ea7',
		'Reboot':     '\u91cd\u542f',
		'Interfaces': '\u63a5\u53e3',
		'Wireless':   '\u65e0\u7ebf',
		'DHCP and DNS': 'DHCP/DNS',
		'Hostnames':  '\u4e3b\u673a\u540d',
		'Static Routes': '\u9759\u6001\u8def\u7531',
		'Firewall':   '\u9632\u706b\u5899',
		'Diagnostics': '\u8bca\u65ad',
		'LED Configuration': 'LED\u914d\u7f6e',
\t\t'Routing': '\u8def\u7531',
\t\t'DHCP': 'DHCP',
\t\t'DNS': 'DNS',
\t\t'Log out': '\u9000\u51fa',
\t\t'Realtime Graphs': '\u5b9e\u65f6\u56fe\u8868',
\t\t'Real-Time': '\u5b9e\u65f6',
\t\t'Traffic': '\u6d41\u91cf'
	}
});
