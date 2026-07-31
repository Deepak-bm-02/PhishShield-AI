export const SERVICE_STATUS = {
  HEALTHY: 'Healthy',
  WARNING: 'Warning',
  OFFLINE: 'Offline',
} as const;

export type ServiceStatus = typeof SERVICE_STATUS[keyof typeof SERVICE_STATUS];
