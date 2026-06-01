# Nexaflow Blog — Complete Setup & Workflow Guide

## What This System Does

You write articles in plain Markdown files.
Run one command.
Every article becomes a full SEO-optimized HTML page with:
- Clean URL (`/blog/article-name/`)
- Auto-generated meta tags, schema, sitemap
- Table of contents, FAQ section, related articles
- Mobile responsive layout
- 95+ Lighthouse SEO score

---

## FIRST TIME SETUP (Do this once)

### Step 1 — Install Node.js

1. Go to https://nodejs.org
2. Download the **LTS version** (green button)
3. Install it (just click Next → Next → Finish)
4. Verify: open Terminal / Command Prompt and type:
   ```
   node --version
   ```
   You should see something like `v20.x.x`

---

### Step 2 — Install Git

1. Go to https://git-scm.com
2. Download and install for your OS
3. Verify:
   ```
   git --version
   ```

---

### Step 3 — Set Up Your Project Folder

1. Put all these files in one folder on your computer:
   ```
   nexaflow-blog/
   ├── articles/         ← your markdown articles go here
   ├── templates/
   │   └── article.html  ← article template (don't edit often)
   ├── src/
   │   ├── style.css     ← your existing style.css
   │   └── article.css   ← your existing article.css
   ├── public/           ← images, favicon, logo.png
   │   ├── logo.png
   │   ├── favicon.png
   │   └── images/
   │       └── blog/     ← article images go here
   ├── build.js
   ├── package.json
   ├── script.js         ← your existing script.js
   └── README.md
   ```

2. Open Terminal in that folder:
   - **Windows**: right-click the folder → "Open in Terminal"
   - **Mac**: drag folder onto Terminal icon

3. Install dependencies (one time only):
   ```
   npm install
   ```
   Wait ~30 seconds. You'll see a `node_modules` folder appear.

---

### Step 4 — Set Up GitHub

1. Create a free account at https://github.com
2. Click **New Repository**
3. Name it: `nexaflow-blog`
4. Set it to **Public**
5. Click **Create Repository**

6. In your terminal, run these commands one by one:
   ```
   git init
   git add .
   git commit -m "initial setup"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nexaflow-blog.git
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub username)

---

### Step 5 — Set Up GitHub Pages

1. Go to your GitHub repo
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under **Source**: select `Deploy from a branch`
5. Under **Branch**: select `main` and folder `/dist`
6. Click **Save**

7. Add your custom domain:
   - Still in Pages settings, enter: `nexaflow.bar`
   - Click **Save**
   - GitHub will show you 4 nameserver addresses

8. Go to your domain registrar (where you bought nexaflow.bar)
   - Find DNS settings
   - Add these GitHub A records:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Wait 24–48 hours for DNS to propagate
   - GitHub will auto-install SSL certificate (free HTTPS)

---

## WRITING AN ARTICLE (Your everyday workflow)

### Step 1 — Create a new .md file in /articles/

Name it using the URL you want. Examples:
- `gbp-optimization-guide.md` → `/blog/gbp-optimization-guide/`
- `local-seo-kanpur.md` → `/blog/local-seo-kanpur/`
- `dental-marketing-tips.md` → `/blog/dental-marketing-tips/`

**Always use lowercase letters and hyphens. No spaces.**

---

### Step 2 — Write your article

Copy this template and fill it in:

```markdown
---
title: "Your Article Title Here"
description: "One sentence description for Google (150-160 characters max)"
category: "Google Business Profile"
date: "2025-06-15"
updated: "2025-06-15"
author: "Nexaflow Team"
image: "/images/blog/your-image.jpg"
tags:
  - "Tag One"
  - "Tag Two"
  - "Tag Three"
featured: false
related:
  - "gbp-optimization-guide"
  - "local-seo-guide"
faqs:
  - q: "Your FAQ question here?"
    a: "Your FAQ answer here."
  - q: "Another question?"
    a: "Another answer."
---

## Your First Heading

Write your article content here in plain Markdown.

## Second Heading

More content...

### Sub-heading

Even more content...
```

**Category options** (use exactly as written):
- `Google Business Profile`
- `Local SEO`
- `Dental Marketing`
- `Homeopathy Marketing`
- `Case Studies`
- `Kanpur`
- `Lucknow`

**featured: true** → shows this article as the big featured card on homepage
**featured: false** → shows as regular article card

---

### Step 3 — Add your image

1. Name your image: `your-article-name.jpg`
2. Size: 1200 × 630 pixels (standard blog image)
3. Place it in: `public/images/blog/`

---

### Step 4 — Build

In your terminal:
```
npm run build
```

You'll see:
```
🔨 Building Nexaflow Blog...

📝 Found 3 articles

📄 Building pages:
  ✓ /blog/gbp-optimization-guide/
  ✓ /blog/local-seo-guide/
  ✓ /blog/your-new-article/
  ✓ index.html

🗺️  Generating SEO files:
  ✓ sitemap.xml
  ✓ robots.txt

📦 Copying assets:
  ✓ style.css
  ✓ article.css
  ✓ script.js

✅ Build complete in 0.45s
```

---

### Step 5 — Push to GitHub (makes it live)

```
git add .
git commit -m "new article: your article title"
git push
```

**Your article is live at nexaflow.bar within 60 seconds.**

---

## COMPLETE EVERYDAY WORKFLOW (5 minutes total)

```
1. Create articles/your-article.md        (write article)
2. Add image to public/images/blog/       (add image)
3. npm run build                          (build it)
4. git add .                              (stage files)
5. git commit -m "new article: title"    (save to git)
6. git push                               (push to GitHub)
                                          ↓
                              Live at nexaflow.bar ✓
```

---

## MARKDOWN QUICK REFERENCE

```markdown
# Heading 1 (use only once, for H1 — auto-generated from title)
## Heading 2 (main sections)
### Heading 3 (sub-sections)

**bold text**
*italic text*
~~strikethrough~~

[Link text](https://example.com)
![Image alt text](/images/example.jpg)

- Bullet point
- Another point

1. Numbered list
2. Second item

> Blockquote text

`inline code`

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

---

## UPDATING AN ARTICLE

1. Open the `.md` file in `/articles/`
2. Make your changes
3. Update the `updated:` date in frontmatter
4. Run `npm run build`
5. `git add . && git commit -m "updated: article name" && git push`

---

## FOLDER STRUCTURE EXPLAINED

```
nexaflow-blog/
│
├── articles/           ← YOU WORK HERE (write .md files)
│
├── templates/          ← HTML shells (set up once, rarely edit)
│   └── article.html
│
├── src/                ← CSS files
│   ├── style.css
│   └── article.css
│
├── public/             ← Static files copied as-is to dist/
│   ├── logo.png
│   ├── favicon.png
│   └── images/
│       └── blog/       ← Article images go here
│
├── dist/               ← AUTO-GENERATED (never edit manually)
│   ├── index.html
│   ├── blog/
│   │   ├── gbp-optimization-guide/
│   │   │   └── index.html
│   │   └── local-seo-guide/
│   │       └── index.html
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── style.css
│   ├── article.css
│   └── script.js
│
├── build.js            ← The build engine (don't edit unless needed)
├── package.json        ← Project config
├── script.js           ← Your existing JS
└── README.md           ← This file
```

**Rule: Never manually edit anything inside `/dist/`**
It gets wiped and rebuilt every time you run `npm run build`.

---

## CHANGING SITE SETTINGS

Open `build.js` and edit the Config section at the top:

```javascript
const SITE_URL  = 'https://nexaflow.bar';   // your domain
const SITE_NAME = 'Nexaflow';               // your brand name
const WA_NUMBER = '919369699864';           // WhatsApp number
const AUTHOR    = 'Nexaflow Team';          // default author name
```

---

## TROUBLESHOOTING

**"npm: command not found"**
→ Node.js is not installed. Go back to Step 1.

**"Cannot find module 'gray-matter'"**
→ Run `npm install` again.

**Build runs but no dist/ folder**
→ Check there are `.md` files in `/articles/` folder.

**Article not showing on homepage**
→ Check `featured: true` is set on one article.
→ Check the article doesn't have `draft: true`.

**Images not showing**
→ Check image path starts with `/images/blog/`
→ Check the file exists in `public/images/blog/`

**GitHub Pages showing old content**
→ Wait 2–3 minutes, then hard refresh (Ctrl+Shift+R)

---

## DRAFT ARTICLES

To write an article but not publish it yet, add `draft: true`:

```markdown
---
title: "My Draft Article"
draft: true
---
```

The build script will skip all draft articles.

---

## NEED HELP?

WhatsApp: +91 93696 99864
Email: support@nexaflow.bar