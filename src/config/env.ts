export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'PhishShield AI',
  appEnv: process.env.APP_ENV || 'development',
};

export const requireEnv = (key: keyof typeof config) => {
  const value = config[key];
  if (!value) {
    throw new Error(`Environment variable for ${key} is missing.`);
  }
  return value;
};
