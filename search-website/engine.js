/* A small, local search index. Results are curated links, not a crawl of the web. */
(function (root) {
  'use strict';
  const pages = [
    { title: 'NASA', url: 'https://www.nasa.gov/', category: 'Science', description: 'Explore space missions, discoveries, aeronautics, and the universe with NASA.', keywords: 'space planets astronomy moon stars rockets' },
    { title: 'NASA Astronomy Picture of the Day', url: 'https://apod.nasa.gov/apod/', category: 'Science', description: 'Discover a different image or photograph of the universe each day.', keywords: 'space photos astronomy galaxies stars' },
    { title: 'Smithsonian National Museum of Natural History', url: 'https://naturalhistory.si.edu/', category: 'Science', description: 'Explore the natural world, from dinosaurs and fossils to oceans and human origins.', keywords: 'nature animals dinosaurs fossils earth' },
    { title: 'Our World in Data', url: 'https://ourworldindata.org/', category: 'World', description: 'Research and data on health, energy, climate, and living conditions around the world.', keywords: 'statistics research global climate population' },
    { title: 'National Geographic', url: 'https://www.nationalgeographic.com/', category: 'World', description: 'Stories about wildlife, travel, science, and the natural world.', keywords: 'animals nature earth travel geography' },
    { title: 'World Health Organization', url: 'https://www.who.int/', category: 'World', description: 'Information and resources on global health from the World Health Organization.', keywords: 'health medicine public disease' },
    { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', category: 'Technology', description: 'Guides and references for HTML, CSS, JavaScript, and building for the web.', keywords: 'coding programming developer web javascript html css' },
    { title: 'Python Documentation', url: 'https://docs.python.org/3/', category: 'Technology', description: 'The official Python language documentation, tutorials, and library reference.', keywords: 'coding programming python developer tutorial' },
    { title: 'GitHub', url: 'https://github.com/', category: 'Technology', description: 'Explore open-source projects, collaborate on code, and build software.', keywords: 'coding programming repository git software' },
    { title: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', category: 'Technology', description: 'Learn to code with free lessons, projects, and programming resources.', keywords: 'coding programming learn web javascript python tutorial' },
    { title: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/', category: 'Culture', description: 'Explore art, exhibitions, and collections spanning thousands of years.', keywords: 'art paintings history museum culture' },
    { title: 'Google Arts & Culture', url: 'https://artsandculture.google.com/', category: 'Culture', description: 'Explore art, history, places, and cultural collections from around the world.', keywords: 'art paintings museum history culture' },
    { title: 'Project Gutenberg', url: 'https://www.gutenberg.org/', category: 'Culture', description: 'Read free ebooks, including classic literature and public-domain works.', keywords: 'books literature reading stories classics' },
    { title: 'Internet Archive', url: 'https://archive.org/', category: 'Culture', description: 'A digital library of books, recordings, websites, and other media.', keywords: 'books history archive music library' },
    { title: 'Khan Academy', url: 'https://www.khanacademy.org/', category: 'Science', description: 'Free lessons in mathematics, science, computing, and more.', keywords: 'learn education math science school study' },
    { title: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/', category: 'Culture', description: 'A collection of freely usable images, sound, video, and other media.', keywords: 'photos images media pictures art' },
    { title: 'OpenStreetMap', url: 'https://www.openstreetmap.org/', category: 'World', description: 'Explore an open, community-built map of the world.', keywords: 'maps geography travel places cities' },
    { title: 'Encyclopaedia Britannica', url: 'https://www.britannica.com/', category: 'World', description: 'Read encyclopedia articles covering history, science, culture, and more.', keywords: 'knowledge encyclopedia history facts learning' }
  ];
  function search(query, category = 'All') {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return pages.map(page => {
      const title = page.title.toLowerCase();
      const text = `${page.title} ${page.description} ${page.keywords} ${page.category}`.toLowerCase();
      if (category !== 'All' && page.category !== category) return null;
      if (!words.every(word => text.includes(word))) return null;
      return { page, score: words.reduce((sum, word) => sum + (title.includes(word) ? 3 : 1), 0) };
    }).filter(Boolean).sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title)).map(item => item.page);
  }
  const api = { pages, search };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.OrbitSearch = api;
})(typeof window !== 'undefined' ? window : globalThis);
