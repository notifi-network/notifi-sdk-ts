#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { config as loadDotEnv } from 'dotenv';

import { createNotifiMcpServer } from './server';
import { startupError } from './utils/errors';

const start = async (): Promise<void> => {
  loadDotEnv();

  const { server, context } = createNotifiMcpServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  const dispose = async () => {
    await context.client.dispose().catch(() => undefined);
    await server.close().catch(() => undefined);
  };

  process.once('SIGINT', () => {
    void dispose().finally(() => process.exit(0));
  });

  process.once('SIGTERM', () => {
    void dispose().finally(() => process.exit(0));
  });
};

void start().catch((error: unknown) => {
  const normalized = startupError(error);
  process.stderr.write(`${normalized.message}\n`);
  process.exitCode = 1;
});
