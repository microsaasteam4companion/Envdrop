#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import Conf from 'conf';
import fs from 'node:fs/promises';
import path from 'node:path';
import fetch from 'node-fetch';
import { encryptData } from './crypto.js';

const config = new Conf({ projectName: 'envdrop' });
const program = new Command();

program
  .name('envdrop')
  .description('Universal CLI for secure, zero-knowledge secret sharing')
  .version('1.0.0');

// 1. LOGIN COMMAND
program
  .command('login')
  .description('Authenticate your CLI with an envdrop API Token')
  .action(async () => {
    const response = await prompts({
      type: 'password',
      name: 'token',
      message: 'Enter your envdrop API Token (sk_ed_...)'
    });

    if (response.token) {
      config.set('token', response.token);
      console.log(chalk.green('\n✔ Authenticated successfully!'));
      console.log(chalk.gray('Your token is stored securely in your home directory.\n'));
    }
  });

// 2. LOGOUT COMMAND
program
  .command('logout')
  .description('Remove your envdrop authentication token')
  .action(() => {
    config.delete('token');
    console.log(chalk.yellow('\n✔ Logged out successfully.\n'));
  });

// 3. PUSH COMMAND
program
  .command('push')
  .description('Encrypt and share a file or text')
  .argument('<path>', 'Path to the file to share')
  .option('-l, --label <string>', 'Custom label for this share')
  .option('-t, --ttl <string>', 'Time To Live (e.g., 24h, 7d, once)', '24h')
  .option('-o, --open', 'Open the link in your browser immediately')
  .action(async (filePath, options) => {
    const spinner = ora('Preparing transmission...').start();
    
    // Auth Check
    const token = process.env.ENVDROP_TOKEN || config.get('token') as string;
    if (!token) {
      spinner.fail(chalk.red('Not authenticated.'));
      console.log(chalk.yellow('\nRun "envdrop login" or set ENVDROP_TOKEN environment variable.\n'));
      return;
    }

    try {
      // 1. Read File
      const fullPath = path.resolve(filePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      const label = options.label || path.basename(fullPath);

      // 2. Encrypt (Zero-Knowledge)
      spinner.text = 'Encrypting secrets locally...';
      const { encrypted, key } = await encryptData(content);

      // 3. Post to API
      spinner.text = 'Broadcasting to envdrop cloud...';
      const response = await fetch('https://envdrop-uaru.vercel.app/api/share', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': token
        },
        body: JSON.stringify({
          encrypted,
          label,
          ttl: options.ttl
        })
      });

      const data: any = await response.json();

      if (data.id) {
        const shareUrl = `https://envdrop-uaru.vercel.app/share/${data.id}#${key}`;
        spinner.succeed(chalk.green('Transmission successful!'));
        
        console.log('\n' + chalk.cyan('  Share URL: ') + chalk.white.bold(shareUrl));
        console.log(chalk.gray('  (Decryption key is included in the URL fragment)\n'));

        if (options.open) {
          const { default: open } = await import('open');
          await open(shareUrl);
        }
      } else {
        throw new Error(data.error || 'Unknown server error');
      }
    } catch (err: any) {
      spinner.fail(chalk.red('Failed to push secret.'));
      console.error(chalk.red(`\nError: ${err.message}\n`));
    }
  });

program.parse();
