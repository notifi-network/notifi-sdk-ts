import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { version } from '../package.json';
import {
  NotifiMcpClient,
  NotifiMcpClientConfig,
  createNotifiMcpClient,
} from './NotifiMcpClient';

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
    version,
  });

  return {
    server,
    context: { client },
  };
};
