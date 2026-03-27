/**
 * ANPC培训文档 — 目录交互 & 滚动监听
 */

(function () {
  'use strict';

  // ── 目录展开/折叠 ──────────────────────────────
  document.querySelectorAll('.toc-chapter-title').forEach(function (title) {
    title.addEventListener('click', function () {
      var chapter = this.parentElement;
      chapter.classList.toggle('open');
    });
  });

  // ── 点击节标题平滑滚动 ──────────────────────────
  document.querySelectorAll('.toc-section').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('href').replace('#', '');
      var target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 顶部章节名更新 & 目录高亮 ──────────────────
  var contentEl = document.getElementById('content');
  var chapterTitleEl = document.getElementById('current-chapter');
  var allSections = Array.from(document.querySelectorAll('[data-section]'));
  var allTocSections = document.querySelectorAll('.toc-section');
  var allTocChapterTitles = document.querySelectorAll('.toc-chapter-title');

  function onScroll() {
    var scrollTop = contentEl.scrollTop;
    var containerTop = contentEl.getBoundingClientRect().top;

    // 找当前可见的最近 section
    var current = null;
    allSections.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var relTop = rect.top - containerTop;
      if (relTop <= 40) {
        current = el;
      }
    });

    if (!current && allSections.length > 0) {
      current = allSections[0];
    }

    if (!current) return;

    var sectionId = current.id;
    var chapterId = current.getAttribute('data-chapter');

    // 更新顶部章节名
    if (chapterTitleEl) {
      chapterTitleEl.textContent = current.getAttribute('data-label') || '';
    }

    // 高亮目录节
    allTocSections.forEach(function (link) {
      var href = link.getAttribute('href').replace('#', '');
      if (href === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 高亮目录章 & 确保已展开
    allTocChapterTitles.forEach(function (title) {
      var chapter = title.parentElement;
      var cid = chapter.getAttribute('data-chapter-id');
      if (cid === chapterId) {
        title.classList.add('active');
        chapter.classList.add('open');
      } else {
        title.classList.remove('active');
      }
    });
  }

  if (contentEl) {
    contentEl.addEventListener('scroll', onScroll, { passive: true });
    // 初始化
    setTimeout(onScroll, 100);
  }

  // 默认展开第一章
  var firstChapter = document.querySelector('.toc-chapter');
  if (firstChapter) firstChapter.classList.add('open');

})();
