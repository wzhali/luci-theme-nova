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

			var icon = this._icon(child.title);
			var li = E('li', { 'class': isActive ? 'active' : '' }, [
				E('a', { 'href': L.url(child.name) }, [ icon + this._t(child.title) ])
			]);
			menu.appendChild(li);

			if (isActive) {
				var sub = this.renderMainMenu(child, child.name);
				if (sub) li.appendChild(sub);
			}
		}, this);

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

	_t: function(key) {
		var translated = _(key);
		if (translated === key && this._zh[key])
			return this._zh[key];
		return translated;
	},

	_icons: {
		'Status': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
		'System': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1.08 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08z"/></svg>',
		'Services': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
		'Network': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16M4 4h16v12H4z"/></svg>',
		'Logout': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
		'Statistics': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
		'Firewall': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
	},

	_icon: function(title) {
		return this._icons[title] || '';
	},

	_zh: {
		'Status': '\u72b6\u6001',
		'System': '\u7cfb\u7edf',
		'Services': '\u670d\u52a1',
		'Network': '\u7f51\u7edc',
		'Logout': '\u9000\u51fa',
		'Overview': '\u6982\u89c8',
		'Routes': '\u8def\u7531',
		'System Log': '\u7cfb\u7edf\u65e5\u5fd7',
		'Kernel Log': '\u5185\u6838\u65e5\u5fd7',
		'Processes': '\u8fdb\u7a0b',
		'Administration': '\u7ba1\u7406',
		'Software': '\u8f6f\u4ef6',
		'Startup': '\u542f\u52a8',
		'Scheduled Tasks': '\u8ba1\u5212\u4efb\u52a1',
		'Mount Points': '\u6302\u8f7d\u70b9',
		'Backup / Flash Firmware': '\u5907\u4efd/\u5347\u7ea7',
		'Reboot': '\u91cd\u542f',
		'Interfaces': '\u63a5\u53e3',
		'Wireless': '\u65e0\u7ebf',
		'DHCP and DNS': 'DHCP/DNS',
		'Hostnames': '\u4e3b\u673a\u540d',
		'Static Routes': '\u9759\u6001\u8def\u7531',
		'Firewall': '\u9632\u706b\u5899',
		'Diagnostics': '\u8bca\u65ad',
		'LED Configuration': 'LED\u914d\u7f6e',
		'Routing': '\u8def\u7531',
		'DHCP': 'DHCP',
		'DNS': 'DNS',
		'Log out': '\u9000\u51fa',
		'Realtime Graphs': '\u5b9e\u65f6\u56fe\u8868',
		'Real-Time': '\u5b9e\u65f6',
		'Traffic': '\u6d41\u91cf',
		'Statistics': '\u7edf\u8ba1'
	}
});
