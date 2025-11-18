#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import { GeminiSearch } from '../lib/index.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log(chalk.cyan.bold('\n🤖 GeminiSearch CLI - Google Gemini AI with Search Grounding\n'));

  try {
    // Check if API key exists in environment
    let apiKey = process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey) {
      console.log(chalk.yellow('⚠️  No API key found in environment variables.'));

      // Try to load from .env file
      const envPath = path.join(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        console.log(chalk.blue('📄 Found .env file, trying to load API key from there...'));
        // Note: dotenv is imported in the index.js file
      }

      const { shouldEnterKey } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldEnterKey',
          message: 'Would you like to enter your Google Gemini API key now?',
          default: true
        }
      ]);

      if (shouldEnterKey) {
        const { apiKey: enteredKey } = await inquirer.prompt([
          {
            type: 'password',
            name: 'apiKey',
            message: 'Enter your Google Gemini API key:',
            validate: (input) => {
              if (input.length < 10) {
                return 'API key appears to be too short. Please enter a valid key.';
              }
              return true;
            }
          }
        ]);
        apiKey = enteredKey;
      } else {
        console.log(chalk.red('❌ No API key provided. Exiting.'));
        process.exit(1);
      }
    }

    // Initialize GeminiSearch
    const geminiSearch = new GeminiSearch(apiKey);

    const { model } = await inquirer.prompt([
      {
        type: 'list',
        name: 'model',
        message: 'Select Gemini model:',
        choices: [
          { name: 'Gemini 2.5 Flash (Recommended)', value: 'gemini-2.5-flash' },
          { name: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
          { name: 'Gemini 2.5 Flash-Lite', value: 'gemini-2.5-flash-lite' },
          { name: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
          { name: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
          { name: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' }
        ],
        default: 'gemini-2.5-flash'
      }
    ]);

    console.log(chalk.green('\n✅ Ready to answer your questions!'));
    console.log(chalk.gray('Type your question and press Enter. Type "exit" or "quit" to leave.\n'));

    while (true) {
      const { question } = await inquirer.prompt([
        {
          type: 'input',
          name: 'question',
          message: chalk.blue('💭 Your question:'),
          validate: (input) => {
            if (!input.trim()) {
              return 'Please enter a question.';
            }
            return true;
          }
        }
      ]);

      if (question.toLowerCase() === 'exit' || question.toLowerCase() === 'quit') {
        console.log(chalk.green('\n👋 Goodbye!'));
        break;
      }

      await geminiSearch.ask(question, model);
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
  }
}

main();