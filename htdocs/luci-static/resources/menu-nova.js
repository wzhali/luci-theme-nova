'use strict';
'require baseclass';
'require ui';

return baseclass.extend({
	__init__() {
		ui.menu.load().then((tree) => this.render(tree));
	},

	render(tree) {
		let node = tree;
		let url = '';

		this.renderModeMenu(tree);

		if (L.env.dispatchpath.length >= 3) {
			for (var i = 0; i < 3 && node; i++) {
				node = node.children[L.env.dispatchpath[i]];
				url = url + (url ? '/' : '') + L.env.dispatchpath[i];
			}

			if (node)
				this.renderTabMenu(node, url);
		}
	},

	renderModeMenu(tree) {
		var menu = document.querySelector('#modemenu');
		if (!menu) return;

		var children = ui.menu.getChildren(tree);

		children.forEach(function(child, index) {
			var isActive = L.env.requestpath.length
				? child.name === L.env.requestpath[0]
				: index === 0;

			var li = E('li', { 'class': isActive ? 'active' : '' }, [
				E('a', { 'href': L.url(child.name) }, [ _(child.title) ])
			]);
			menu.appendChild(li);

			if (isActive) {
				var sub = this.renderMainMenu(child, child.name);
				if (sub) li.appendChild(sub);
			}
		}, this);

		if (menu.children.length > 1)
			menu.style.display = '';
	},

	renderMainMenu(tree, url, level) {
		var l = (level || 0) + 1;
		var children = ui.menu.getChildren(tree);

		if (children.length === 0 || l > 2)
			return null;

		var ul = E('ul', { 'class': 'l%d'.format(l) });

		children.forEach(function(child) {
			var isActive = (L.env.dispatchpath[l] == child.name);
			var sub = this.renderMainMenu(child, url + '/' + child.name, l);
			var children_elements = [ E('a', { 'href': L.url(url + '/' + child.name) }, [ _(child.title) ]) ];
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

		if (children.length === 0)
			return;

		children.forEach(function(child) {
			var isActive = (L.env.dispatchpath[l + 2] == child.name);
			var activeClass = isActive ? ' cbi-tab' : '';

			ul.appendChild(E('li', {
				'class': 'tabmenu-item-%s%s'.format(child.name, activeClass)
			}, [
				E('a', { 'href': L.url(url, child.name) }, [ _(child.title) ])
			]));

			if (isActive)
				activeNode = child;
		});

		container.appendChild(ul);
		container.style.display = '';

		if (activeNode)
			container.appendChild(this.renderTabMenu(activeNode, url + '/' + activeNode.name, l));
	}
});
