import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { NotifiMcpServerContext } from '../server';
import { registerGetActiveAlerts } from './getActiveAlerts';
import { registerGetTenantConfig } from './getTenantConfig';
import { registerPublishFusionMessage } from './publishFusionMessage';

/**
 * Register all Notifi MCP tools on the given server instance.
 */
export const registerNotifiMcpTools = (
  server: McpServer,
  context: NotifiMcpServerContext,
): void => {
  registerGetTenantConfig(server, context);
  registerGetActiveAlerts(server, context);
  registerPublishFusionMessage(server, context);
};
