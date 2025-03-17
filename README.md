# RepoMind

<div align="center">

<img src="public/logo.svg" width="150" height="150" alt="RepoMind Logo">

[![GitHub license](https://img.shields.io/github/license/mustafaabdullahk/repomind)](https://github.com/mustafaabdullahk/repomind/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/mustafaabdullahk/repomind)](https://github.com/mustafaabdullahk/repomind/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/mustafaabdullahk/repomind)](https://github.com/mustafaabdullahk/repomind/network/members)
[![GitHub issues](https://img.shields.io/github/issues/mustafaabdullahk/repomind)](https://github.com/mustafaabdullahk/repomind/issues)
[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://mustafaabdullahk.github.io/repomind/)

**AI-powered GitHub repository explorer and analyzer**

</div>

## 📖 About

RepoMind is a modern web application that helps developers discover and understand GitHub repositories more efficiently. It uses AI to analyze repositories and provide insightful summaries, key features, and technical details, saving you time when exploring new projects.

### 🚀 Features

- 🔍 **GitHub Repository Search**: Search GitHub repositories by keyword, language, stars, and more
- 🤖 **AI-Powered Summaries**: Generate concise summaries of repositories using various AI models
- 🔄 **Multi-Provider Support**: Compare results from OpenAI, Mistral, Gemini, Claude, and DeepSeek
- 📊 **Repository Analysis**: Identify key features, technologies used, and difficulty level
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- 🌓 **Dark Mode Support**: Easy on your eyes during those late-night coding sessions

## 🖥️ Live Demo

Check out the live demo at [https://mustafaabdullahk.github.io/repomind/](https://mustafaabdullahk.github.io/repomind/)

## ⚙️ Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **APIs**: GitHub API, OpenAI API, Mistral AI, Google Gemini, Anthropic Claude, DeepSeek
- **Deployment**: GitHub Pages, GitHub Actions
- **Testing**: Vitest, MSW (Mock Service Worker)

## 🛠️ Installation and Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- GitHub API Token (for higher rate limits)
- At least one AI provider API key (OpenAI, Mistral, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mustafaabdullahk/repomind.git
cd repomind
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```
# Not required, but recommended for higher GitHub API rate limits
GITHUB_TOKEN=your_github_token

# Base path for GitHub Pages deployment (only needed for production)
# NEXT_PUBLIC_BASE_PATH=/repomind
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### API Keys Configuration

RepoMind supports multiple AI providers. You'll need to obtain API keys for the providers you want to use and configure them in the Settings page:

- [OpenAI API](https://platform.openai.com/api-keys)
- [Mistral AI API](https://console.mistral.ai/)
- [Google Gemini API](https://ai.google.dev/)
- [Anthropic Claude API](https://www.anthropic.com/api)
- [DeepSeek API](https://platform.deepseek.ai/)

## 🚢 Deployment

RepoMind is configured for easy deployment to GitHub Pages using GitHub Actions.

1. Fork this repository
2. Go to the repository settings > Pages
3. Select "GitHub Actions" as the source
4. Push to the master branch to trigger deployment

The GitHub Action will automatically build and deploy your site to GitHub Pages.

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

For test coverage:

```bash
npm run test:coverage
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's style guidelines and includes appropriate tests.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- [GitHub API](https://docs.github.com/en/rest) for repository data
- [OpenAI](https://openai.com/), [Mistral AI](https://mistral.ai/), [Google Gemini](https://ai.google.dev/), [Anthropic Claude](https://www.anthropic.com/), and [DeepSeek](https://platform.deepseek.ai/) for AI models

## 📧 Contact

Project Link: [https://github.com/mustafaabdullahk/repomind](https://github.com/mustafaabdullahk/repomind)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/mustafaabdullahk">Mustafa Abdullah</a>
</div> 