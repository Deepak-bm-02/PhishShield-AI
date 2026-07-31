import { loggingConfig } from '../../config';
import { RequestContext, getDuration } from '../requestContext';

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

type LogLevel = keyof typeof levels;

function shouldLog(level: LogLevel): boolean {
  if (!loggingConfig.enabled) return false;
  return levels[level] >= levels[loggingConfig.level as LogLevel];
}

function formatMessage(level: LogLevel, message: string, ctx?: RequestContext, data?: any) {
  const parts = [`[${new Date().toISOString()}] [${level.toUpperCase()}]`];
  if (ctx) {
    parts.push(`[${ctx.requestId}] [${ctx.httpMethod} ${ctx.endpoint}]`);
  }
  parts.push(message);
  if (data) {
    if (data instanceof Error) {
      parts.push(data.stack || data.message);
    } else {
      parts.push(JSON.stringify(data));
    }
  }
  if (ctx && (level === 'info' || level === 'error')) {
    parts.push(`- ${getDuration(ctx)}ms`);
  }
  return parts.join(' ');
}

export const logger = {
  debug: (msg: string, ctx?: RequestContext, data?: any) => {
    if (shouldLog('debug')) console.debug(formatMessage('debug', msg, ctx, data));
  },
  info: (msg: string, ctx?: RequestContext, data?: any) => {
    if (shouldLog('info')) console.info(formatMessage('info', msg, ctx, data));
  },
  warn: (msg: string, ctx?: RequestContext, data?: any) => {
    if (shouldLog('warn')) console.warn(formatMessage('warn', msg, ctx, data));
  },
  error: (msg: string, ctx?: RequestContext, data?: any) => {
    if (shouldLog('error')) console.error(formatMessage('error', msg, ctx, data));
  },
};
