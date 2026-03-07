import 'react-router';

export type AppEnv = Env;

declare module 'react-router' {
  interface AppLoadContext {
    cloudflare: {
      env: AppEnv;
      ctx: ExecutionContext;
    };
  }
}
