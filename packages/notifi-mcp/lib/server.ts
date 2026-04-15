import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import {
  NotifiMcpClient,
  NotifiMcpClientConfig,
  createNotifiMcpClient,
} from './notifi-client';

export type NotifiMcpServerContext = Readonly<{
  client: NotifiMcpClient;
}>;

export type CreateNotifiMcpServerOptions = Readonly<{
  client?: NotifiMcpClient;
  config?: NotifiMcpClientConfig;
}>;

export type CreatedNotifiMcpServer = Readonly<{
  server: McpServer;
  context: NotifiMcpServerContext;
}>;

export const createNotifiMcpServer = (
  options: CreateNotifiMcpServerOptions = {},
): CreatedNotifiMcpServer => {
  const client = options.client ?? createNotifiMcpClient(options.config);
  const server = new McpServer({
    name: 'notifi',
    version: '8.0.0',
  });

  return {
    server,
    context: { client },
  };
};
