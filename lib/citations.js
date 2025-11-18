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
        if (uri) {
          return `[${i + 1}](${uri})`;
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
      sources += `${chalk.green(index + 1)}. ${chalk.white(chunk.web.title)}\n   ${chalk.blue(chunk.web.uri)}\n\n`;
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