# envdrop Universal CLI

The official command-line interface for **envdrop**. Share secrets securely from any terminal or CI/CD pipeline with Zero-Knowledge encryption. ✨🔐

## Features

- **Zero-Knowledge**: Encryption happens locally in your terminal before broadcasting. 
- **Universal**: Works on Windows, Mac, and Linux.
- **CI/CD Ready**: Supports `ENVDROP_TOKEN` environment variable.
- **Fast**: Quick `push` and `login` commands with beautiful terminal output.

## Installation (Local Development)

1. Open this `envdrop-cli` folder in your terminal.
2. Run `npm install` and `npm run build`.
3. Link the package: `npm link`.
4. You can now use the `envdrop` command anywhere!

## Commands

### 1. Authenticate
```bash
envdrop login
```
*Paste your `sk_ed_...` token from the dashboard.*

### 2. Push a Secret
```bash
envdrop push .env
```
*Specify a custom label or TTL:*
```bash
envdrop push .env --label "Production Keys" --ttl 7d
```

### 3. Open in Browser
```bash
envdrop push .env --open
```

## Security

envdrop CLI uses **AES-256-GCM** encryption by default. We never see your raw secrets. Your decryption key is stored only in the URL fragment (`#`) which never leaves your browser.
