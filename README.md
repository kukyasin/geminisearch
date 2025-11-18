# GeminiSearch CLI

A powerful command-line interface for Google Gemini AI with Google Search grounding capabilities.

## Features

- **Google Search Grounding**: Get AI responses grounded in real-time web search results
- **Automatic Citations**: Built-in citation system with source links
- **Interactive CLI**: User-friendly command-line interface
- **Multiple Models**: Support for all Gemini AI models
- **Source Display**: View search queries and web sources used
- **Easy Setup**: Simple API key configuration

## Installation

#### Option 1: Global Installation (Recommended) - Auto PATH Setup

```bash
npm install -g geminisearch-cli
geminisearch
```

**The installation now automatically sets up your PATH!**

After installation, you'll see a message like:
```
GeminiSearch CLI - Setting up PATH...
npm global bin: /Users/yourname/.npm-global/bin
SUCCESS: Added to /Users/yourname/.zshrc
SUCCESS: PATH setup completed!
Please restart your terminal or run: source ~/.zshrc
```

Just restart your terminal and run:
```bash
geminisearch
```

#### Option 2: Direct Run (No Installation - No PATH Setup Needed)

```bash
npx geminisearch-cli
```

#### Option 3: Local Installation

```bash
npm install geminisearch-cli
npx geminisearch-cli
```

## Getting Started

### Prerequisites

You need a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### Usage

1. **Run the CLI**:
   ```bash
   geminisearch
   ```

2. **Enter your API key** when prompted (or set `GOOGLE_GENAI_API_KEY` environment variable)

3. **Select your preferred Gemini model**:
   - Gemini 2.5 Flash (Recommended)
   - Gemini 2.5 Pro
   - Gemini 2.5 Flash-Lite
   - Gemini 2.0 Flash
   - Gemini 1.5 Pro
   - Gemini 1.5 Flash

4. **Start asking questions**

### Environment Variable Setup (Optional)

You can skip the API key prompt by setting the environment variable:

```bash
export GOOGLE_GENAI_API_KEY=your-gemini-api-key
```

Or create a `.env` file in your project:

```
GOOGLE_GENAI_API_KEY=your-gemini-api-key
```

## Example Usage

```bash
$ geminisearch

GeminiSearch CLI - Google Gemini AI with Search Grounding

No API key found in environment variables.
? Would you like to enter your Google Gemini API key now? Yes
? Enter your Google Gemini API key: [hidden]
? Select Gemini model: Gemini 2.5 Flash (Recommended)

Ready to answer your questions!
Type your question and press Enter. Type "exit" or "quit" to leave.

Your question: What are the latest developments in quantum computing?

Question: "What are the latest developments in quantum computing?"
Model: gemini-2.5-flash
Searching and generating response...

Response:
==================
Recent quantum computing breakthroughs include...
==================

With citations:
========================
Recent quantum computing breakthroughs include...[1](https://example.com), [2](https://example.com)

--- Search Queries ---
1. "latest quantum computing developments 2024"
2. "quantum computing breakthroughs recent"

--- Sources ---
1. Latest Quantum Computing News
   https://example.com/quantum-news

2. Quantum Research Updates
   https://example.com/quantum-research
```

## Available Models

| Model | Description | Use Case |
|-------|-------------|----------|
| **Gemini 2.5 Flash** | Fast, efficient (default) | General purpose, quick responses |
| **Gemini 2.5 Pro** | Advanced capabilities | Complex queries, detailed analysis |
| **Gemini 2.5 Flash-Lite** | Lightweight, cost-effective | Simple questions, cost-sensitive use |
| **Gemini 2.0 Flash** | High-performance | Speed-critical applications |
| **Gemini 1.5 Pro** | Mature, reliable | Production applications |
| **Gemini 1.5 Flash** | Balanced performance | Most use cases |

## API Pricing

When using Google Search Grounding, you are billed for each search query the model executes. For detailed pricing information, visit the [Gemini API pricing page](https://ai.google.dev/pricing).

## Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/kukyasin/geminisearch.git
cd geminisearch

# Install dependencies
npm install

# Run locally
npm start
```

### Project Structure

```
geminisearch/
├── bin/
│   └── geminisearch.js      # CLI entry point
├── lib/
│   ├── index.js            # Main GeminiSearch class
│   └── citations.js        # Citation formatting utilities
├── package.json            # Package configuration
├── README.md              # This file
└── LICENSE                # MIT License
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### "Command Not Found" Error

If you get `command not found: geminisearch` after global installation:

1. **Quick Fix - Use npx** (recommended):
   ```bash
   npx geminisearch-cli
   ```

2. **Permanent Fix - Update PATH**:
   ```bash
   # Check your npm global bin directory
   npm config get prefix

   # Add it to your shell profile (one-time setup)
   echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.zshrc  # macOS
   echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.bashrc  # Linux

   # Restart terminal or run:
   source ~/.zshrc  # or source ~/.bashrc
   ```

3. **Verify Installation**:
   ```bash
   npm list -g geminisearch-cli
   ```

### Other Issues

- **Node.js Version**: Ensure you have Node.js 14.0.0 or higher
- **Permission Error**: Try `sudo npm install -g geminisearch-cli` (last resort)
- **Network Issues**: Check your internet connection and npm registry

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Report bugs**: [GitHub Issues](https://github.com/kukyasin/geminisearch/issues)
- **Feature requests**: [GitHub Discussions](https://github.com/kukyasin/geminisearch/discussions)
- **Contact**: [yasin7kuk@gmail.com](mailto:yasin7kuk@gmail.com)

## Acknowledgments

- [Google Gemini API](https://ai.google.dev/) for the powerful AI capabilities
- [Google Search](https://www.google.com/) for providing real-time web information
- The open-source community for inspiration and tools

---

**Made by [Yasin Kuk](https://github.com/kukyasin)**