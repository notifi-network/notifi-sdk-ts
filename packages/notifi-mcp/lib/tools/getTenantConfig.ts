import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import type { NotifiMcpServerContext } from '../server';
import { redactErrorMessage } from '../utils/errors';

export const registerGetTenantConfig = (
  server: McpServer,
  context: NotifiMcpServerContext,
): void => {
  server.tool(
    'get_tenant_config',
    'Look up a Notifi tenant subscription-card config by ID and tenant slug. Returns the card layout JSON, associated fusion events, and their metadata.',
    {
      id: z.string().describe('The unique ID of the tenant config'),
      tenant: z.string().describe('The tenant identifier (slug)'),
    },
    async ({ id, tenant }) => {
      try {
        const result = await context.client.runWithAuthRetry(() =>
          context.client.service.findTenantConfig({
            input: { id, tenant, type: 'SUBSCRIPTION_CARD' },
          }),
        );

        const config = result.findTenantConfig;

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  id: config.id,
                  type: config.type,
                  dataJson: config.dataJson,
                  fusionEvents: (config.fusionEvents ?? [])
                    .filter((e): e is NonNullable<typeof e> => e !== undefined)
                    .map((e) => ({
                      id: e.id ?? null,
                      name: e.name ?? null,
                      metadata: e.metadata ?? null,
                    })),
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: `Failed to fetch tenant config: ${redactErrorMessage(error)}`,
            },
          ],
        };
      }
    },
  );
};
