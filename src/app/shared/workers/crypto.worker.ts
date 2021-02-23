/// <reference lib="webworker" />

import * as aesjs from 'aes-js';

addEventListener('message', async ({ data }) => {
  const { requestId, action, content, password } = data;

  if (action === 'encrypt') {
    const result = await encrypt(content, password);
    postMessage({requestId, action, result});
  } else if (action === 'decrypt') {
    const result = await decrypt(content, password);
    postMessage({requestId, action, result});
  } else {
    postMessage({requestId, action, result: 'Hi'});
  }
});

async function hashPassword(password: string): Promise<Uint8Array> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return new Uint8Array(hashBuffer);
}

async function encrypt(content: string, password: string): Promise<string> {
  const bufPassword = await hashPassword(password);

  // Convert string content (plain) to bytes
  const contentBytes = aesjs.utils.utf8.toBytes(content);

  // AES mode of operation (CTR) with counter starting at 1337
  const aesCtr = new aesjs.ModeOfOperation.ctr(bufPassword, new aesjs.Counter(1337));

  // Encrypt content
  const encryptedBytes = aesCtr.encrypt(contentBytes);

  // Convert encrypted bytes to hex string
  return aesjs.utils.hex.fromBytes(encryptedBytes);
}

async function decrypt(content: string, password: string): Promise<any> {
  const bufPassword = await hashPassword(password);

  // Convert string content (hex) to bytes
  const contentBytes = aesjs.utils.hex.toBytes(content);

  // AES mode of operation (CTR) with counter starting at 1337
  const aesCtr = new aesjs.ModeOfOperation.ctr(bufPassword, new aesjs.Counter(1337));

  // Decrypt content
  const decryptedBytes = aesCtr.decrypt(contentBytes);

  // Convert decrypted bytes to string
  return aesjs.utils.utf8.fromBytes(decryptedBytes);
}
