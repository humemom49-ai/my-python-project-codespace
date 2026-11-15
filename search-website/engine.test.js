const test = require('node:test');
const assert = require('node:assert/strict');
const { pages, search } = require('./engine');

test('empty search shows the full index', () => {
  assert.equal(search('').length, pages.length);
});
test('search is case insensitive and matches keywords', () => {
  assert.ok(search('  SPACE ').some(page => page.title === 'NASA'));
});
test('all search words must match and categories filter results', () => {
  assert.ok(search('space astronomy', 'Science').some(page => page.title === 'NASA'));
  assert.equal(search('space astronomy', 'Technology').length, 0);
  assert.equal(search('space zzzz').length, 0);
});
test('title matches are ranked first', () => {
  assert.equal(search('python')[0].title, 'Python Documentation');
});
test('links are unique and use HTTPS', () => {
  assert.equal(new Set(pages.map(page => page.url)).size, pages.length);
  assert.ok(pages.every(page => new URL(page.url).protocol === 'https:'));
});
