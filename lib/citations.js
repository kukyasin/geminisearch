import chalk from 'chalk';

/**
 * Utility function to add inline citations to Gemini API responses
 * @param {Object} response - Gemini API response
 * @returns {string} - Text with citations added
 */
export function addCitations(response) {
  let text = response.text;
  const supports = response.candidates[0]?.groundingMetadata?.groundingSupports;
  const chunks = response.candidates[0]?.groundingMetadata?.groundingChunks;

  if (!supports || !chunks) {
    return text;
  }

  // Sort supports by end_index in descending order to avoid shifting issues when inserting.
  const sortedSupports = [...supports].sort(
    (a, b) => (b.segment?.endIndex ?? 0) - (a.segment?.endIndex ?? 0),
  );

  for (const support of sortedSupports) {
    const endIndex = support.segment?.endIndex;
    if (endIndex === undefined || !support.groundingChunkIndices?.length) {
      continue;
    }

    const citationLinks = support.groundingChunkIndices
      .map(i => {
        const uri = chunks[i]?.web?.uri;
        const title = chunks[i]?.web?.title;
        if (uri && title) {
          // Use the actual title from the source
          const shortTitle = title.length > 30 ? title.substring(0, 27) + "..." : title;
          return `[${shortTitle}]`;
        }
        return null;
      })
      .filter(Boolean);

    if (citationLinks.length > 0) {
      const citationString = citationLinks.join(", ");
      text = text.slice(0, endIndex) + chalk.blue(citationString) + text.slice(endIndex);
    }
  }

  return text;
}

/**
 * Extract site name from URI
 * @param {string} uri - Original URI
 * @returns {string} - Site name
 */
function extractSiteName(uri) {
  try {
    // For Google redirect URLs, we'll extract from the chunks
    if (uri.startsWith('https://vertexaisearch.cloud.google.com/grounding-api-redirect/')) {
      return "Source";
    }

    // Extract domain from regular URLs
    const url = new URL(uri);
    const domain = url.hostname;

    // Remove www. prefix and get clean domain
    const cleanDomain = domain.replace(/^www\./, '');

    // Split by dots and take the main domain name
    const parts = cleanDomain.split('.');

    // For common domains, return the main name
    if (parts.length >= 2) {
      const mainDomain = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      return mainDomain;
    }

    return cleanDomain;
  } catch (error) {
    return "Source";
  }
}

/**
 * Format URI for better readability and usability
 * @param {string} uri - Original URI
 * @returns {string} - Formatted URI
 */
function formatUri(uri) {
  // If it's a Google redirect URL, extract meaningful info or create a cleaner format
  if (uri.startsWith('https://vertexaisearch.cloud.google.com/grounding-api-redirect/')) {
    // Extract domain from the redirect if possible, or use a cleaner format
    try {
      // For now, return a more user-friendly format
      return "[Google Search Result]";
    } catch (error) {
      return uri;
    }
  }

  // For regular URLs, return as-is
  return uri;
}

/**
 * Extract real URI from Google redirect URL if possible
 * @param {string} googleRedirectUri - Google redirect URI
 * @returns {string} - Original URI or redirect URI if extraction fails
 */
function extractRealUri(googleRedirectUri) {
  try {
    // Try to decode and extract the original URL from the redirect
    const url = new URL(googleRedirectUri);
    const originalUrl = url.searchParams.get('url');

    if (originalUrl) {
      return decodeURIComponent(originalUrl);
    }

    // If no direct URL parameter, return a cleaner format
    return formatUri(googleRedirectUri);
  } catch (error) {
    // If URL parsing fails, return the original
    return formatUri(googleRedirectUri);
  }
}

/**
 * Display citation sources in formatted way
 * @param {Object} response - Gemini API response
 * @returns {string} - Formatted source list
 */
export function formatSources(response) {
  const chunks = response.candidates[0]?.groundingMetadata?.groundingChunks;

  if (!chunks || chunks.length === 0) {
    return "";
  }

  let sources = "\n" + chalk.green("--- Sources ---") + "\n";
  chunks.forEach((chunk, index) => {
    if (chunk.web) {
      // Use title and provide a cleaner format for the URI
      const title = chunk.web.title || 'Unknown Source';
      const uri = chunk.web.uri;

      // For Google redirect URLs, show a cleaner format
      let displayUri = uri;
      if (uri.startsWith('https://vertexaisearch.cloud.google.com/grounding-api-redirect/')) {
        displayUri = "[Google Search Result]";
      }

      sources += `${chalk.green(index + 1)}. ${chalk.white(title)}\n   ${chalk.blue(displayUri)}\n\n`;
    }
  });

  return sources;
}

/**
 * Display search queries
 * @param {Object} response - Gemini API response
 * @returns {string} - Formatted search queries
 */
export function formatSearchQueries(response) {
  const queries = response.candidates[0]?.groundingMetadata?.webSearchQueries;

  if (!queries || queries.length === 0) {
    return "";
  }

  let searchInfo = "\n" + chalk.blue("--- Search Queries ---") + "\n";
  queries.forEach((query, index) => {
    searchInfo += `${chalk.blue(index + 1)}. "${chalk.white(query)}"\n`;
  });

  return searchInfo;
}