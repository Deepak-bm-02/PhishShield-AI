import { NextResponse } from 'next/server';
import { RequestContext, getDuration } from '../requestContext';
import { appConfig } from '../../config';

interface Metadata {
  requestId: string;
  timestamp: string;
  duration: number;
  version: string;
}

export function successResponse(data: any, ctx: RequestContext) {
  const metadata: Metadata = {
    requestId: ctx.requestId,
    timestamp: new Date().toISOString(),
    duration: getDuration(ctx),
    version: appConfig.version,
  };
  return NextResponse.json({ success: true, data, error: null, metadata });
}

export function failureResponse(errorMsg: string, statusCode: number, ctx: RequestContext, details?: any) {
  const metadata: Metadata = {
    requestId: ctx.requestId,
    timestamp: new Date().toISOString(),
    duration: getDuration(ctx),
    version: appConfig.version,
  };
  return NextResponse.json({ success: false, data: null, error: { message: errorMsg, details }, metadata }, { status: statusCode });
}
