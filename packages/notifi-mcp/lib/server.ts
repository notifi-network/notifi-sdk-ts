import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { version } from '../package.json';
import {
  NotifiMcpClient,
  NotifiMcpClientConfig,
  createNotifiMcpClient,
} from './NotifiMcpClient';
import { registerNotifiMcpTools } from './tools';

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

  const context: NotifiMcpServerContext = { client };
  registerNotifiMcpTools(server, context);

  return { server, context };
};
