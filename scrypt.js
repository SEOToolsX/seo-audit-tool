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

// Fetch HTML content from URL using a CORS proxy
async function fetchHtmlContent(url) {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const response = await fetch(`${proxyUrl}${encodeURIComponent(url)}`);
    const data = await response.json();
    return data.contents;
}

// Example SEO analysis functions
function analyzeMetaTitle(doc) {
    const title = doc.querySelector('title');
    if (!title) {
        return { score: 0, message: 'No title tag found.' };
    }
    const titleText = title.textContent.trim();
    const length = titleText.length;
    if (length === 0) {
        return { score: 0, message: 'Title tag is empty.' };
    }
    if (length < 50 || length > 60) {
        return { score: 70, message: `Title tag is ${length} characters long. Aim for 50-60 characters.` };
    }
    return { score: 100, message: `Title tag is optimal: "${titleText}"` };
}

function analyzeMetaDescription(doc) {
    const metaDescription = doc.querySelector('meta[name="description"]');
    if (!metaDescription) {
        return { score: 0, message: 'No meta description found.' };
    }
    const description = metaDescription.getAttribute('content').trim();
    const length = description.length;
    if (length === 0) {
        return { score: 0, message: 'Meta description is empty.' };
    }
    if (length < 120 || length > 160) {
        return { score: 70, message: `Meta description is ${length} characters long. Aim for 120-160 characters.` };
    }
    return { score: 100, message: `Meta description is optimal: "${description}"` };
}

// Add other analysis functions here...

function displayReport(report) {
    const reportContainer = document.getElementById('report');
    reportContainer.innerHTML = `
        <div class="report-item">
            <h3 class="text-xl font-semibold text-blue-600">Meta Title</h3>
            <p class="score">Score: ${report.metaTitle.score}/100</p>
            <p>${report.metaTitle.message}</p>
        </div>
        <div class="report-item">
            <h3 class="text-xl font-semibold text-blue-600">Meta Description</h3>
            <p class="score">Score: ${report.metaDescription.score}/100</p>
            <p>${report.metaDescription.message}</p>
        </div>
        <!-- Add more report items here -->
    `;
            }
