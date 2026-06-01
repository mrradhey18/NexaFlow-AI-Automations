/**
 * ═══════════════════════════════════════════════
 * NEXAFLOW BLOG — BUILD SCRIPT
 * Converts Markdown articles → full SEO HTML pages
 * ═══════════════════════════════════════════════
 *
 * HOW IT WORKS:
 * 1. Reads every .md file from /articles/
 * 2. Parses frontmatter (title, description, etc.)
 * 3. Converts Markdown body → HTML
 * 4. Injects into article template
 * 5. Writes final HTML to /dist/blog/slug/index.html
 * 6. Rebuilds index.html articles section
 * 7. Generates sitemap.xml + robots.txt
 *
 * USAGE:
 *   npm run build          → build once
 *   npm run watch          → rebuild on file change
 */

'use strict';

const fs       = require('fs-extra');
const path     = require('path');
const matter   = require('gray-matter');
const { marked } = require('marked');

/* ── Config ── */
const SITE_URL    = 'https://nexaflow.bar';
const SITE_NAME   = 'Nexaflow';
const WA_NUMBER   = '919369699864';
const AUTHOR      = 'Nexaflow Team';

const DIRS = {
  articles:  path.join(__dirname, 'articles'),
  templates: path.join(__dirname, 'templates'),
  dist:      path.join(__dirname, 'dist'),
  src:       path.join(__dirname, 'src'),
  public:    path.join(__dirname, 'public'),
};

/* ── Configure marked for clean HTML ── */
marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
  mangle: false,
});

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */

/** Calculate reading time from word count */
function readingTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Format date: "2025-06-01" → "June 1, 2025" */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

/** ISO date with timezone */
function isoDate(dateStr) {
  if (!dateStr) return new Date().toISOString();
  return new Date(dateStr).toISOString();
}

/** Slug from filename: "gbp-guide.md" → "gbp-guide" */
function slugify(filename) {
  return path.basename(filename, '.md');
}

/** Extract headings from HTML for Table of Contents */
function extractTOC(html) {
  const headingRegex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
  const toc = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    toc.push({
      level: parseInt(match[1]),
      id:    match[2],
      text:  match[3].replace(/<[^>]+>/g, ''), // strip inner tags
    });
  }
  return toc;
}

/** Build TOC HTML from headings array */
function buildTOCHtml(toc) {
  if (toc.length < 2) return '';
  const items = toc.map(h => {
    const indent = h.level === 3 ? ' style="padding-left:1.25rem"' : '';
    return `<li${indent}><a href="#${h.id}" class="toc-link">${h.text}</a></li>`;
  }).join('\n');
  return `
<nav class="toc" id="toc" aria-label="Table of contents">
  <div class="toc-header">
    <span class="toc-title">Table of Contents</span>
    <button class="toc-toggle" id="toc-toggle" aria-label="Toggle table of contents">−</button>
  </div>
  <ol class="toc-list" id="toc-list">
    ${items}
  </ol>
</nav>`;
}

/** Build FAQ schema JSON-LD */
function buildFAQSchema(faqs) {
  if (!faqs || faqs.length === 0) return '';
  const mainEntity = faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }));
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity
  }, null, 2);
}

/** Build FAQ HTML section */
function buildFAQHtml(faqs) {
  if (!faqs || faqs.length === 0) return '';
  const items = faqs.map((f, i) => `
    <div class="faq-item" itemscope itemtype="https://schema.org/Question">
      <button class="faq-question" aria-expanded="false"
              aria-controls="faq-a-${i}" id="faq-q-${i}" itemprop="name">
        ${f.q}
        <span class="faq-icon" aria-hidden="true">+</span>
      </button>
      <div class="faq-answer" id="faq-a-${i}" role="region"
           aria-labelledby="faq-q-${i}" hidden
           itemscope itemtype="https://schema.org/Answer">
        <div itemprop="text"><p>${f.a}</p></div>
      </div>
    </div>`).join('\n');

  return `
<section class="article-faq" aria-labelledby="faq-heading">
  <h2 id="faq-heading">Frequently Asked Questions</h2>
  <div class="faq-list">${items}</div>
</section>`;
}

/** Build related articles HTML */
function buildRelatedHtml(related, allArticles) {
  if (!related || related.length === 0) return '';
  const cards = related.map(slug => {
    const art = allArticles.find(a => a.slug === slug);
    if (!art) return '';
    return `
      <article class="article-card">
        <div class="article-card-img article-card-img--sm">
          <img src="${art.image || '/images/placeholder.jpg'}"
               alt="${art.title}" loading="lazy"
               decoding="async" width="400" height="225" />
          <span class="article-card-category">${art.category || ''}</span>
        </div>
        <div class="article-card-body">
          <h3 class="article-card-title">
            <a href="/blog/${art.slug}/">${art.title}</a>
          </h3>
          <p class="article-card-excerpt">${art.description || ''}</p>
          <a href="/blog/${art.slug}/" class="article-read-link">Read →</a>
        </div>
      </article>`;
  }).join('\n');

  return `
<section class="related-section" aria-labelledby="related-heading">
  <div class="container">
    <h2 class="related-heading" id="related-heading">Continue Reading</h2>
    <div class="related-grid">${cards}</div>
  </div>
</section>`;
}

/** Build breadcrumb HTML + schema */
function buildBreadcrumbs(article) {
  const crumbs = [
    { name: 'Home',  url: `${SITE_URL}/` },
    { name: 'Blog',  url: `${SITE_URL}/blog/` },
  ];
  if (article.category) {
    const catSlug = article.category.toLowerCase().replace(/\s+/g, '-');
    crumbs.push({ name: article.category, url: `${SITE_URL}/blog/${catSlug}/` });
  }
  crumbs.push({ name: article.title, url: `${SITE_URL}/blog/${article.slug}/` });

  const html = crumbs.map((c, i) => {
    if (i === crumbs.length - 1) {
      return `<li class="breadcrumb-item breadcrumb-item--current" aria-current="page">${c.name}</li>`;
    }
    return `<li class="breadcrumb-item"><a href="${c.url}">${c.name}</a></li>`;
  }).join('<li class="breadcrumb-sep" aria-hidden="true">›</li>');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    }))
  };

  return {
    html: `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol class="breadcrumb-list">${html}</ol></nav>`,
    schema: JSON.stringify(schema, null, 2)
  };
}

/* ══════════════════════════════════════════════
   PARSE ALL ARTICLES
══════════════════════════════════════════════ */

function parseArticles() {
  if (!fs.existsSync(DIRS.articles)) {
    console.log('⚠️  No /articles/ folder found. Creating it...');
    fs.mkdirSync(DIRS.articles, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(DIRS.articles)
    .filter(f => f.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b));

  return files.map(file => {
    const raw     = fs.readFileSync(path.join(DIRS.articles, file), 'utf8');
    const { data, content } = matter(raw);
    const slug    = slugify(file);
    const html    = marked.parse(content);
    const minutes = readingTime(content);

    return {
      slug,
      title:       data.title       || 'Untitled',
      description: data.description || '',
      category:    data.category    || 'General',
      date:        data.date        || '',
      updated:     data.updated     || data.date || '',
      author:      data.author      || AUTHOR,
      image:       data.image       || '/images/placeholder.jpg',
      tags:        data.tags        || [],
      faqs:        data.faqs        || [],
      related:     data.related     || [],
      featured:    data.featured    || false,
      draft:       data.draft       || false,
      content,
      html,
      minutes,
    };
  }).filter(a => !a.draft); // skip drafts
}

/* ══════════════════════════════════════════════
   BUILD SINGLE ARTICLE PAGE
══════════════════════════════════════════════ */

function buildArticlePage(article, allArticles) {
  const template = fs.readFileSync(
    path.join(DIRS.templates, 'article.html'), 'utf8'
  );

  const pageUrl    = `${SITE_URL}/blog/${article.slug}/`;
  const toc        = extractTOC(article.html);
  const tocHtml    = buildTOCHtml(toc);
  const faqHtml    = buildFAQHtml(article.faqs);
  const faqSchema  = buildFAQSchema(article.faqs);
  const relatedHtml = buildRelatedHtml(article.related, allArticles);
  const breadcrumb = buildBreadcrumbs(article);
  const tagList    = article.tags.join(', ');

  /* Article JSON-LD */
  const articleSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: article.title,
    description: article.description,
    image: {
      '@type': 'ImageObject',
      url: article.image.startsWith('http') ? article.image : `${SITE_URL}${article.image}`,
      width: 1200,
      height: 630
    },
    datePublished: isoDate(article.date),
    dateModified:  isoDate(article.updated || article.date),
    author: {
      '@type': 'Organization',
      name: article.author,
      '@id': `${SITE_URL}/#organization`
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      '@id': `${SITE_URL}/#organization`,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    articleSection: article.category,
    keywords: article.tags,
    wordCount: article.content.trim().split(/\s+/).length,
    timeRequired: `PT${article.minutes}M`,
    inLanguage: 'en-IN',
  }, null, 2);

  /* Replace all template placeholders */
  let page = template
    .replace(/\{\{SITE_URL\}\}/g,        SITE_URL)
    .replace(/\{\{SITE_NAME\}\}/g,       SITE_NAME)
    .replace(/\{\{PAGE_URL\}\}/g,        pageUrl)
    .replace(/\{\{TITLE\}\}/g,           article.title)
    .replace(/\{\{DESCRIPTION\}\}/g,     article.description)
    .replace(/\{\{CATEGORY\}\}/g,        article.category)
    .replace(/\{\{CATEGORY_SLUG\}\}/g,   article.category.toLowerCase().replace(/\s+/g, '-'))
    .replace(/\{\{DATE_ISO\}\}/g,        isoDate(article.date))
    .replace(/\{\{DATE_UPDATED_ISO\}\}/g, isoDate(article.updated || article.date))
    .replace(/\{\{DATE_DISPLAY\}\}/g,    formatDate(article.date))
    .replace(/\{\{DATE_UPDATED_DISPLAY\}\}/g, formatDate(article.updated || article.date))
    .replace(/\{\{AUTHOR\}\}/g,          article.author)
    .replace(/\{\{IMAGE\}\}/g,           article.image.startsWith('http') ? article.image : `${SITE_URL}${article.image}`)
    .replace(/\{\{TAGS\}\}/g,            tagList)
    .replace(/\{\{READ_TIME\}\}/g,       `${article.minutes} min read`)
    .replace(/\{\{SLUG\}\}/g,            article.slug)
    .replace(/\{\{WA_NUMBER\}\}/g,       WA_NUMBER)
    .replace(/\{\{ARTICLE_BODY\}\}/g,    article.html)
    .replace(/\{\{TOC\}\}/g,             tocHtml)
    .replace(/\{\{FAQ_HTML\}\}/g,        faqHtml)
    .replace(/\{\{RELATED_HTML\}\}/g,    relatedHtml)
    .replace(/\{\{BREADCRUMB_HTML\}\}/g, breadcrumb.html)
    .replace(/\{\{ARTICLE_SCHEMA\}\}/g,  articleSchema)
    .replace(/\{\{BREADCRUMB_SCHEMA\}\}/g, breadcrumb.schema)
    .replace(/\{\{FAQ_SCHEMA\}\}/g,      faqSchema ? faqSchema : '');

  /* Write file */
  const outDir = path.join(DIRS.dist, 'blog', article.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), page, 'utf8');

  console.log(`  ✓ /blog/${article.slug}/`);
}

/* ══════════════════════════════════════════════
   BUILD INDEX PAGE (update articles section)
══════════════════════════════════════════════ */

function buildIndexPage(articles) {
  const template = fs.readFileSync(
    path.join(DIRS.templates, 'index.html'), 'utf8'
  );

  /* Build article cards HTML */
  const featured = articles.find(a => a.featured) || articles[0];
  const rest     = articles.filter(a => a.slug !== featured?.slug).slice(0, 3);

  function cardHtml(art, isFeatured = false) {
    return `
<article class="article-card ${isFeatured ? 'article-card--featured' : ''}"
         itemscope itemtype="https://schema.org/Article">
  <meta itemprop="author" content="${art.author}" />
  <a href="/blog/${art.slug}/" class="article-card-img-link" tabindex="-1" aria-hidden="true">
    <div class="article-card-img ${isFeatured ? '' : 'article-card-img--sm'}">
      <img src="${art.image}" alt="${art.title}" loading="lazy"
           decoding="async" width="${isFeatured ? 800 : 600}"
           height="${isFeatured ? 450 : 338}" itemprop="image" />
      <span class="article-card-category">${art.category}</span>
    </div>
  </a>
  <div class="article-card-body">
    <div class="article-card-meta">
      <time datetime="${isoDate(art.date)}" itemprop="datePublished">
        ${formatDate(art.date)}
      </time>
      <span class="meta-sep" aria-hidden="true">·</span>
      <span>${art.minutes} min read</span>
    </div>
    <h3 class="article-card-title" itemprop="headline">
      <a href="/blog/${art.slug}/">${art.title}</a>
    </h3>
    <p class="article-card-excerpt" itemprop="description">${art.description}</p>
    <a href="/blog/${art.slug}/" class="article-read-link">Read guide →</a>
  </div>
</article>`;
  }

  const articlesHtml = featured
    ? cardHtml(featured, true) + rest.map(a => cardHtml(a)).join('\n')
    : '<p>No articles yet.</p>';

  let page = template
    .replace('{{ARTICLES_GRID}}', articlesHtml)
    .replace(/\{\{SITE_URL\}\}/g, SITE_URL)
    .replace(/\{\{SITE_NAME\}\}/g, SITE_NAME);

  fs.mkdirSync(DIRS.dist, { recursive: true });
  fs.writeFileSync(path.join(DIRS.dist, 'index.html'), page, 'utf8');
  console.log('  ✓ index.html');
}

/* ══════════════════════════════════════════════
   GENERATE SITEMAP.XML
══════════════════════════════════════════════ */

function buildSitemap(articles) {
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '/', priority: '1.0', freq: 'weekly' },
    { url: '/blog/', priority: '0.9', freq: 'daily' },
    { url: '/blog/local-seo/', priority: '0.8', freq: 'weekly' },
    { url: '/blog/google-business-profile/', priority: '0.8', freq: 'weekly' },
    { url: '/blog/dental-marketing/', priority: '0.8', freq: 'weekly' },
    { url: '/blog/homeopathy-marketing/', priority: '0.8', freq: 'weekly' },
    { url: '/blog/case-studies/', priority: '0.8', freq: 'weekly' },
    { url: '/kanpur/', priority: '0.7', freq: 'weekly' },
    { url: '/lucknow/', priority: '0.7', freq: 'weekly' },
  ];

  const articleUrls = articles.map(a => ({
    url: `/blog/${a.slug}/`,
    lastmod: (a.updated || a.date || today).toString().split('T')[0],
    priority: '0.7',
    freq: 'monthly'
  }));

  const all = [...staticPages, ...articleUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${all.map(p => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${p.lastmod || today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(DIRS.dist, 'sitemap.xml'), xml, 'utf8');
  console.log('  ✓ sitemap.xml');
}

/* ══════════════════════════════════════════════
   GENERATE ROBOTS.TXT
══════════════════════════════════════════════ */

function buildRobots() {
  const txt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(DIRS.dist, 'robots.txt'), txt, 'utf8');
  console.log('  ✓ robots.txt');
}

/* ══════════════════════════════════════════════
   COPY STATIC ASSETS
══════════════════════════════════════════════ */

function copyAssets() {
  /* Copy CSS files */
  const cssFiles = ['style.css', 'article.css'];
  cssFiles.forEach(f => {
    const src = path.join(DIRS.src, f);
    if (fs.existsSync(src)) {
      fs.copySync(src, path.join(DIRS.dist, f));
      console.log(`  ✓ ${f}`);
    }
  });

  /* Copy script.js */
  const jsFile = path.join(__dirname, 'script.js');
  if (fs.existsSync(jsFile)) {
    fs.copySync(jsFile, path.join(DIRS.dist, 'script.js'));
    console.log('  ✓ script.js');
  }

  /* Copy public folder (images, favicon, etc.) */
  if (fs.existsSync(DIRS.public)) {
    fs.copySync(DIRS.public, DIRS.dist, { overwrite: true });
    console.log('  ✓ public/ assets');
  }
}

/* ══════════════════════════════════════════════
   MAIN BUILD
══════════════════════════════════════════════ */

function build() {
  console.log('\n🔨 Building Nexaflow Blog...\n');
  const start = Date.now();

  /* Clean dist */
  fs.emptyDirSync(DIRS.dist);

  /* Parse all .md files */
  const articles = parseArticles();
  console.log(`📝 Found ${articles.length} articles\n`);

  /* Build pages */
  console.log('📄 Building pages:');
  articles.forEach(a => buildArticlePage(a, articles));
  buildIndexPage(articles);

  /* Generate SEO files */
  console.log('\n🗺️  Generating SEO files:');
  buildSitemap(articles);
  buildRobots();

  /* Copy assets */
  console.log('\n📦 Copying assets:');
  copyAssets();

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\n✅ Build complete in ${elapsed}s`);
  console.log(`📁 Output: /dist/ (${articles.length} articles)\n`);
}

/* ══════════════════════════════════════════════
   WATCH MODE
══════════════════════════════════════════════ */

function watch() {
  build();

  try {
    const chokidar = require('chokidar');
    const watcher  = chokidar.watch(
      [DIRS.articles, DIRS.templates, DIRS.src],
      { ignoreInitial: true }
    );

    watcher.on('all', (event, filePath) => {
      console.log(`\n🔄 Change detected: ${path.basename(filePath)}`);
      build();
    });

    console.log('👁️  Watching for changes... (Ctrl+C to stop)\n');
  } catch (e) {
    console.log('⚠️  chokidar not installed — watch mode unavailable');
  }
}

/* ── Entry Point ── */
if (process.argv.includes('--watch')) {
  watch();
} else {
  build();
}