import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import chalk from "chalk";
import { addCitations, formatSources, formatSearchQueries } from "./citations.js";

// Load .env file
dotenv.config();

export class GeminiSearch {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    this.apiKey = apiKey;
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Generate response using Google Search grounding
   * @param {string} prompt - User question
   * @param {string} model - Model to use (default: gemini-2.5-flash)
   */
  async ask(prompt, model = "gemini-2.5-flash") {
    try {
      console.log(chalk.cyan(`\nQuestion: "${prompt}"`));
      console.log(chalk.blue(`Model: ${model}`));
      console.log(chalk.yellow("Searching and generating response...\n"));

      // Configure Google Search tool
      const groundingTool = {
        googleSearch: {},
      };

      const config = {
        tools: [groundingTool],
      };

      // Send request
      const response = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
        config: config,
      });

      // Check response
      if (!response.candidates || response.candidates.length === 0) {
        console.log(chalk.red("ERROR: No response received."));
        return null;
      }

      const candidate = response.candidates[0];
      const groundingMetadata = candidate.groundingMetadata;

      // Basic response
      console.log(chalk.green("RESPONSE:"));
      console.log(chalk.gray("=================="));
      console.log(response.text);
      console.log(chalk.gray("=================="));

      // Show grounding information if available
      if (groundingMetadata) {
        // Response with citations
        const textWithCitations = addCitations(response);
        console.log(chalk.cyan("\nWITH CITATIONS:"));
        console.log(chalk.gray("========================"));
        console.log(textWithCitations);

        // Show search queries
        const searchQueries = formatSearchQueries(response);
        if (searchQueries) {
          console.log(chalk.blue(searchQueries));
        }

        // Show sources
        const sources = formatSources(response);
        if (sources) {
          console.log(chalk.green(sources));
        }

        return {
          originalText: response.text,
          textWithCitations: textWithCitations,
          groundingMetadata: groundingMetadata,
          searchQueries: groundingMetadata.webSearchQueries || [],
          sources: groundingMetadata.groundingChunks || []
        };
      } else {
        console.log(chalk.yellow("\n⚠️ This response is not grounded with Google Search."));
        return {
          originalText: response.text,
          textWithCitations: response.text,
          groundingMetadata: null,
          searchQueries: [],
          sources: []
        };
      }

    } catch (error) {
      console.error(chalk.red("ERROR:"), error.message);
      return null;
    }
  }
}

export { addCitations, formatSources, formatSearchQueries } from './citations.js';