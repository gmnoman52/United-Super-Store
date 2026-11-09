// Hash locally; only the bcrypt hash is emitted, never the plaintext passcode.
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const bcrypt = require(join(homedir(), '.codex', 'tools', 'owner-auth', 'node_modules', 'bcryptjs'));
const source = join(homedir(), '.codex', 'secrets', 'united-super-store-owner-passcode.txt');
const passcode = readFileSync(source, 'utf8').replace(/^\uFEFF/, '').replace(/[\r\n]+$/, '');
if (passcode.length < 12 || Buffer.byteLength(passcode, 'utf8') > 72) {
  console.error('Use at least 12 characters and no more than 72 UTF-8 bytes');
  process.exit(1);
}
console.log(JSON.stringify({ login: 'owner@united-super-store.invalid', hash: bcrypt.hashSync(passcode, 12) }));
