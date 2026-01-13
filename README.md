# progga (প্রজ্ঞা)

**Progga** is a CLI tool that generates a single Markdown file representing the essential context of a software project.
The output is optimized for uploading to AI assistants (ChatGPT, Claude, Gemini) so they can understand a project quickly and accurately.

---

## Getting Started

### Run with npx (recommended)

```bash
npx progga@latest
```

This generates a file named:

```
PROJECT_DOCUMENTATION.md
```

in the current directory.

### Run on a specific project

```bash
progga /path/to/project
```

### Custom output file

```bash
progga . my-ai-context.md
```

---

## How Progga Works (Short Example)

Given a project like:

```
my-app/
├── src/
│   └── index.js
├── package.json
├── node_modules/
└── build/
```

Progga generates a single Markdown file containing:

* A clean folder tree (excluding `node_modules`, `build`, etc.)
* The contents of relevant source files
* Proper code blocks with language hints

Example output structure:

````markdown
# Project Documentation: my-app

## Folder Structure
my-app/
├── src/
│   └── index.js
├── package.json

## File Contents
### src/index.js
```js
// file content here
````

You can upload this file directly to an AI and ask questions about the project.

## Project Presets

Progga supports project-type presets that control what files are included.

Currently supported:
- `generic` (default)
- `flutter` (Android, iOS, Web, Windows, macOS, Linux)

If no preset is provided, Progga attempts to detect the project type and asks which preset to use.

```bash
progga --preset flutter
````

---

## Contributing

Contributions are welcome.

Good areas to contribute:

* New project presets (Node.js, Python, Go, etc.)
* Improving Flutter include-only rules
* Performance improvements
* Better project auto-detection
* Documentation and examples

### How to contribute

1. Fork the repository
2. Create a feature branch
3. Make focused changes
4. Open a pull request with a clear description

Opening an issue to discuss ideas is also encouraged.

---

## Requirements

* Node.js 12 or newer (Node 18+ recommended)

---

## License

MIT License

