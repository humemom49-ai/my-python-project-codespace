(function () {
  'use strict';
  const { pages, search } = window.OrbitSearch;
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  const results = document.getElementById('results');
  const empty = document.getElementById('empty');
  const heading = document.getElementById('results-heading');
  const description = document.getElementById('results-description');
  const count = document.getElementById('result-count');
  const savedButton = document.getElementById('saved-toggle');
  const savedCount = document.getElementById('saved-count');
  const webLink = document.getElementById('web-link');
  const categoryButtons = [...document.querySelectorAll('.filter')];
  const storageKey = 'orbit-saved-pages';
  let category = 'All';
  let query = new URLSearchParams(window.location.search).get('q') || '';
  let savedOnly = false;
  let saved = new Set();
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(stored)) saved = new Set(stored.filter(url => pages.some(page => page.url === url)));
  } catch (_) { /* The search still works if browser storage is unavailable. */ }
  input.value = query;
  document.getElementById('collection-count').textContent = pages.length;

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify([...saved])); } catch (_) { /* Storage can be disabled. */ }
  }
  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function bookmarkIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z');
    svg.append(path); return svg;
  }
  function makeCard(page) {
    const card = node('article', 'result-card');
    const top = node('div', 'card-top');
    const label = node('span', 'category-label', page.category);
    const bookmark = node('button', 'bookmark');
    bookmark.type = 'button';
    bookmark.setAttribute('aria-label', `${saved.has(page.url) ? 'Remove' : 'Save'} ${page.title}`);
    bookmark.setAttribute('aria-pressed', String(saved.has(page.url)));
    bookmark.append(bookmarkIcon());
    bookmark.addEventListener('click', () => {
      if (saved.has(page.url)) saved.delete(page.url); else saved.add(page.url);
      save(); render();
    });
    top.append(label, bookmark);
    const title = node('a', 'card-title', page.title);
    title.href = page.url; title.target = '_blank'; title.rel = 'noopener noreferrer';
    const desc = node('p', 'card-desc', page.description);
    const bottom = node('div', 'card-bottom');
    const url = node('span', 'card-url', new URL(page.url).hostname.replace(/^www\./, ''));
    const visit = node('a', 'visit-link', 'Visit site ↗');
    visit.href = page.url; visit.target = '_blank'; visit.rel = 'noopener noreferrer';
    bottom.append(url, visit);
    card.append(top, title, desc, bottom);
    return card;
  }
  function render() {
    let matches = search(query, category);
    if (savedOnly) matches = matches.filter(page => saved.has(page.url));
    results.replaceChildren(...matches.map(makeCard));
    empty.hidden = matches.length > 0;
    heading.textContent = savedOnly ? 'Your saved discoveries.' : query ? `Results for “${query}”` : 'Explore the collection.';
    description.textContent = savedOnly ? 'Your favorite finds, all in one place.' : query ? 'A little something from our curated collection.' : 'A few thoughtfully picked places to get you started.';
    count.textContent = `${matches.length} ${matches.length === 1 ? 'place' : 'places'}`;
    savedCount.textContent = saved.size;
    savedButton.setAttribute('aria-pressed', String(savedOnly));
    webLink.href = query ? `https://duckduckgo.com/?q=${encodeURIComponent(query)}` : 'https://duckduckgo.com/';
    categoryButtons.forEach(button => {
      const active = button.dataset.category === category;
      button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
    });
  }
  function submitSearch(value) {
    query = value.trim(); input.value = query; savedOnly = false; category = 'All';
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    render();
    document.getElementById('discover').scrollIntoView({ behavior: 'smooth' });
  }
  form.addEventListener('submit', event => { event.preventDefault(); submitSearch(input.value); });
  document.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => submitSearch(button.dataset.query)));
  categoryButtons.forEach(button => button.addEventListener('click', () => { category = button.dataset.category; render(); }));
  savedButton.addEventListener('click', () => { savedOnly = !savedOnly; render(); document.getElementById('discover').scrollIntoView({ behavior: 'smooth' }); });
  document.getElementById('clear-search').addEventListener('click', () => submitSearch(''));
  window.addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      event.preventDefault(); input.focus();
    }
  });
  render();
})();
