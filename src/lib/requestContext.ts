export interface RequestContext {
  requestId: string;
  timestamp: string;
  startTime: number;
  httpMethod: string;
  endpoint: string;
  userAgent: string;
}

export function createRequestContext(req: Request): RequestContext {
  return {
    requestId: req.headers.get('x-request-id') || crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    startTime: Date.now(),
    httpMethod: req.method,
    endpoint: new URL(req.url).pathname,
    userAgent: req.headers.get('user-agent') || 'unknown',
  };
}

export function getDuration(ctx: RequestContext): number {
  return Date.now() - ctx.startTime;
}
