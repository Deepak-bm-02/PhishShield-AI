import { NextRequest } from 'next/server';
import { HistoryStorage } from '../../../storage/HistoryStorage';
import { createRequestContext } from '../../../lib/requestContext';
import { successResponse } from '../../../lib/api/response';

export async function GET(req: NextRequest) {
  const ctx = createRequestContext(req);
  const data = await HistoryStorage.getHistory();
  return successResponse(data, ctx);
}
