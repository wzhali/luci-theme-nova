/* ================================================================
 * luci-theme-nova — overview page stat-card enhancer
 * 将 LuCI 概览页标准结构转化为 preview.html 的玻璃态卡片
 * ================================================================ */

'use strict';
'require baseclass';

return baseclass.extend({
	__init__() {
		// Run after page content is loaded
		var self = this;
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', function() { self.transform(); });
		} else {
			setTimeout(function() { self.transform(); }, 500);
		}
	},

	transform() {
		if (!L.env || !L.env.dispatchpath) return;
		var dp = L.env.dispatchpath;
		if (dp[0] !== 'admin' || dp[1] !== 'status' || dp[2] !== 'overview') return;

		var container = document.querySelector('#maincontent');
		if (!container) return;

		// Find all cbi-sections (Memory, Storage, Network, DHCP)
		var sections = container.querySelectorAll('.cbi-section');
		if (!sections.length) return;

		// Create stat grid wrapper
		var statGrid = E('div', { 'class': 'overview-stats' });
		var firstNonStat = null;
		var extras = [];

		sections.forEach(function(section) {
			var title = section.querySelector('.cbi-title h3');
			var titleText = title ? title.textContent.trim() : '';
			var sectionId = titleText.toLowerCase();

			// Only transform Memory, Storage, Network sections into stat cards
			if (titleText.indexOf('内存') !== -1 ||
			    titleText.indexOf('Memory') !== -1 ||
			    titleText.indexOf('存储') !== -1 ||
			    titleText.indexOf('Storage') !== -1 ||
			    titleText.indexOf('网络') !== -1 ||
			    titleText.indexOf('Network') !== -1) {

				section.classList.add('stat-card');
				statGrid.appendChild(section);
			} else {
				// Keep non-stat sections (DHCP, etc.) outside the grid
				extras.push(section);
			}
		});

		// Insert stat grid before the heading or as first child
		var heading = container.querySelector('h2[name=content]');
		if (heading) {
			heading.parentNode.insertBefore(statGrid, heading.nextSibling);
		} else {
			container.insertBefore(statGrid, container.firstChild);
		}

		// Ensure extras stay after the grid
		extras.forEach(function(section) {
			statGrid.parentNode.insertBefore(section, statGrid.nextSibling);
		});
	}
});
