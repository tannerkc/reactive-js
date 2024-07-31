# generate-reactive-app

A CLI tool to quickly scaffold a new @tco/reactive (Reactive.js) application.

## Description

`generate-reactive-app` is a command-line interface tool that helps you create a new @tco/reactive (Reactive.js) application with a basic project structure and configuration. It sets up all the necessary files and dependencies to get you started with @tco/reactive (Reactive.js) development.

## Installation

You don't need to install this package globally. You can run it directly using `npx` or `bunx`:

```bash
npx generate-reactive-app [project-name]
# or
bunx generate-reactive-app [project-name]  # recommended (this CLI is built with Bun and needs Bun installed)
```

## Usage

To create a new @tco/reactive (Reactive.js) application, run:

```bash
bunx generate-reactive-app my-app
```

If you want to create the app in the current directory, you can run:

```bash
bunx generate-reactive-app .
```

## Features

- Creates a basic @tco/reactive (Reactive.js) application structure
- Sets up TypeScript configuration
- Installs necessary dependencies
- Creates a basic HTML template
- Sets up a basic routing structure
- Automatically updates to the latest version

## Project Structure

The generated project will have the following structure:

```
my-app/
├── src/
│   └── routes/
│       └── index.tsx
├── tsconfig.json
└── package.json
```

## Scripts

The generated `package.json` includes the following scripts:

- `dev`: Run the development server
- `test`: Run tests
- `build`: Build the application for production
- `start`: Start the production server

## Requirements

- Bun.js 1.1.0 or later

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.