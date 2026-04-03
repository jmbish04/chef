import React from 'react';
import { useAgentChat } from '@cloudflare/ai-chat/react';
import { Thread } from './../assistant-ui/thread';

export default function ChatInterface() {
  const runtime = useAgentChat({
    api: '/api/agent', // Hono route that proxies to KitchenOrchestrator
  });

  return (
    <div className="h-[600px] border rounded-xl overflow-hidden bg-background">
      <Thread runtime={runtime} />
    </div>
  );
}
