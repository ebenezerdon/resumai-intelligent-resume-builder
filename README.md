# Resumai - Intelligent Resume Builder

Built by [Teda.dev](https://teda.dev), the AI app builder for everyday problems. Resumai is a modern, privacy-focused resume builder that runs entirely in your browser using local AI for content enhancement.

## Features

- **Buildless Architecture**: Runs directly in the browser with no server-side processing.
- **Local AI**: Uses WebLLM (Qwen2.5-1.5B) to rewrite text and suggest improvements client-side.
- **Privacy First**: All data is stored in `localStorage`. Nothing leaves your device.
- **Live Preview**: Real-time rendering of your resume as you type.
- **PDF Export**: Print-ready output with custom CSS handling.
- **Templates**: Switch between Modern, Classic, and Minimal designs.

## Tech Stack

- **Core**: HTML5, Tailwind CSS, jQuery
- **AI**: WebLLM (MLC AI) via ESM CDN
- **Icons**: Heroicons (SVG)
- **Fonts**: Google Fonts (Inter, Playfair Display, Merriweather, Lato)

## Usage

1. Open `index.html` to view the landing page.
2. Click "Build Resume" to enter the editor (`app.html`).
3. Fill in your details. Use the "AI Rewrite" buttons to enhance your descriptions.
4. Click "Download PDF" to save your resume.

## License

MIT