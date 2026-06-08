/* ================================================================
 * luci-theme-nova — JavaScript（中文适配）
 * ================================================================ */

(function() {
  'use strict';

  /* ─── 深色模式 ─── */
  function getPreferredTheme() {
    var stored = localStorage.getItem('nova-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nova-theme', theme);
  }

  /* 监听系统主题变化（仅当用户没有手动存储偏好时跟随） */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('nova-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ─── 侧栏折叠（移动端） ─── */
  function initSidebarToggle() {
    var toggle = document.getElementById('toggle-sidebar');
    if (!toggle) return;

    toggle.addEventListener('click', function() {
      document.getElementById('menubar').classList.toggle('open');
    });

    document.addEventListener('click', function(e) {
      var menubar = document.getElementById('menubar');
      if (window.innerWidth <= 768 &&
          menubar.classList.contains('open') &&
          !menubar.contains(e.target) &&
          e.target !== toggle) {
        menubar.classList.remove('open');
      }
    });
  }

  /* ─── 子菜单展开/折叠（使用 MutationObserver 解决异步渲染问题） ─── */
  function initSubmenus() {
    var modemenu = document.getElementById('modemenu');
    if (!modemenu) return;

    function bindSubmenus() {
      modemenu.querySelectorAll('li').forEach(function(li) {
        if (li._novaBound) return;
        var ul = li.querySelector('ul');
        if (!ul) return;

        var toggle = li.querySelector('a, span');
        if (!toggle) return;

        toggle.addEventListener('click', function(e) {
          e.preventDefault();
          ul.classList.toggle('open');
          if (toggle.tagName === 'SPAN' || toggle.classList.contains('parent')) {
            toggle.classList.toggle('open');
          }
        });
        li._novaBound = true;
      });
    }

    bindSubmenus();
    var observer = new MutationObserver(function() { bindSubmenus(); });
    observer.observe(modemenu, { childList: true, subtree: true });
  }

  /* ─── 主题切换按钮（置于侧栏右上角） ─── */
  function addThemeToggle() {
    var menubar = document.getElementById('menubar');
    if (!menubar || document.getElementById('theme-toggle')) return;

    var btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.title = '\u5207\u6362\u6df1\u8272/\u6d45\u8272\u6a21\u5f0f';
    btn.setAttribute('aria-label', '\u5207\u6362\u6df1\u8272/\u6d45\u8272\u6a21\u5f0f');

    btn.addEventListener('click', function() {
      setTheme(getPreferredTheme() === 'dark' ? 'light' : 'dark');
    });

    function updateIcon() {
      var dark = getPreferredTheme() === 'dark';
      btn.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        (dark
          ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
          : '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>') +
        '</svg>';
    }

    updateIcon();
    menubar.appendChild(btn);

    var observer = new MutationObserver(function() { updateIcon(); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  /* ─── 初始化 ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initSidebarToggle();
      initSubmenus();
      addThemeToggle();
      markLoginLayout();
    });
  } else {
    initSidebarToggle();
    initSubmenus();
    addThemeToggle();
    markLoginLayout();
  }

  function markLoginLayout() {
    var pageAttr = (document.body.getAttribute('data-page') || '').trim();
    var hasPasswordField = !!document.querySelector('input[type="password"]');
    var mainForm = document.querySelector('#maincontent form');
    var hasMenu = !!document.getElementById('modemenu')?.querySelector('a');

    var dominatedByLoginForm = hasPasswordField && (!hasMenu || (mainForm && mainForm.action && mainForm.action.indexOf('/cgi-bin/luci') !== -1));
    var isLogin = (pageAttr === 'admin') || dominatedByLoginForm;

    document.body.classList.toggle('login-page', isLogin);
  }
})();
