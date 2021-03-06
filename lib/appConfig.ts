import { URL } from "url";

export interface AppConfig {
  isDevelopment: boolean;
  hostingURL: string;
  getJwtConfig(): {
    keyOpts: {
      issuer?: string;
      audience?: string;
    };
    secretOrKey: string | Buffer;
  };
  getCredentialsForOAuthProvider(
    provider: string
  ): {
    provider: string;
    clientID: string;
    clientSecret: string;
  };
  getOAuthCallbackUrl(provider: string, host?: string): string;
}
const isDevelopment = process.env.NODE_ENV !== "production";
const hostingURL = process.env.HOSTING_URL || "http://localhost:3000";

const jwtSecretOrKey = process.env.JWT_SECRET;

type Providers = "google" | "github";

const getOAuthCallbackUrl = (provider: Providers, host?: string) => {
  host = host || hostingURL;
  const callbackUrl = new URL(`/api/auth/callback/${provider}`, host);
  return callbackUrl.toString();
};

const getCredentialsForOAuthProvider = (provider: string) => {
  const prefix = `${provider.toUpperCase()}_`;
  const clientID = process.env[`${prefix}CLIENTID`];
  const clientSecret = process.env[`${prefix}CLIENTSECRET`];
  if (!clientID)
    throw new Error(`${prefix}CLIENTID was not set in environment variables.`);
  if (!clientSecret)
    throw new Error(
      `${prefix}CLIENTSECRET not was set in environment variables.`
    );
  return { provider, clientID, clientSecret };
};
const appConfig: AppConfig = {
  isDevelopment,
  hostingURL,
  getCredentialsForOAuthProvider,
  getOAuthCallbackUrl,
  getJwtConfig: () => {
    return {
      keyOpts: {
        issuer: "accounts.example.com",
        audience: "example.com"
      },
      secretOrKey: jwtSecretOrKey
    };
  }
};

export default appConfig;
