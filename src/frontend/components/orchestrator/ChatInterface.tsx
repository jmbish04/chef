import React from 'react';
import { useAgentChat } from '@cloudflare/ai-chat/react';
import { useLocalRuntime } from '@assistant-ui/react';
import { Thread } from './../assistant-ui/thread';

export default function ChatInterface() {
  const agentState = useAgentChat({
    api: '/api/agent', // Hono route that proxies to KitchenOrchestrator
  });

  // @assistant-ui v0.12+ uses runtime instead of generic props
  const runtime = useLocalRuntime(agentState);

  return (
    <div className="h-[600px] border rounded-xl overflow-hidden bg-background">
      <Thread runtime={runtime} />
    </div>
  );
}
