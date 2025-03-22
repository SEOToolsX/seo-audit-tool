// Toggle between HTML content and URL modes
const toggleModeButton = document.getElementById('toggle-mode');
const htmlContentGroup = document.getElementById('html-content-group');
const urlGroup = document.getElementById('url-group');
let isUrlMode = false;

toggleModeButton.addEventListener('click', function (e) {
    e.preventDefault();
    isUrlMode = !isUrlMode;
    htmlContentGroup.classList.toggle('hidden', isUrlMode);
    urlGroup.classList.toggle('hidden', !isUrlMode);
    toggleModeButton.textContent = isUrlMode ? 'Switch to HTML Mode' : 'Switch to URL Mode';
});

// Handle form submission
document.getElementById('seo-audit-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Show loading spinner
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('report').innerHTML = '';

    try {
        let htmlContent;
        if (isUrlMode) {
            const siteUrl = document.getElementById('site-url').value;
            if (!siteUrl) {
                alert('Please enter a valid URL.');
                return;
            }
            htmlContent = await fetchHtmlContent(siteUrl);
        } else {
            htmlContent = document.getElementById('html-content').value;
        }

        const keywords = document.getElementById('keywords').value.split(',').map(k => k.trim());
        const canonicalUrl = document.getElementById('canonical-url').value;

        // Parse HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Analyze SEO
        const report = {
            metaTitle: analyzeMetaTitle(doc),
            metaDescription: analyzeMetaDescription(doc),
            headings: analyzeHeadings(doc),
            keywordDensity: analyzeKeywordDensity(doc, keywords),
            imageAltText: analyzeImageAltText(doc),
            canonicalUrl: analyzeCanonicalUrl(doc, canonicalUrl),
            internalLinks: analyzeInternalLinks(doc),
            externalLinks: analyzeExternalLinks(doc),
            schemaMarkup: analyzeSchemaMarkup(doc),
            socialMetaTags: analyzeSocialMetaTags(doc),
            readability: analyzeReadability(doc),
            contentLength: analyzeContentLength(doc),
            brokenLinks: analyzeBrokenLinks(doc),
            mobileFriendly: analyzeMobileFriendly(doc),
            pageSpeedTips: getPageSpeedTips(doc)
        };

        // Display report
        displayReport(report);
    } catch (error) {
        alert('Failed to fetch HTML content. Please check the URL and try again.');
        console.error(error);
    } finally {
        // Hide loading spinner
        document.getElementById('loading').classList.add('hidden');
    }
});

// Fetch HTML content from URL
async function fetchHtmlContent(url) {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data.contents;
}

// Existing functions (meta title, meta description, headings, keyword density, image alt text, canonical URL, internal/external links, schema markup, social meta tags, readability, content length, broken links, mobile-friendliness, page speed tips)...
