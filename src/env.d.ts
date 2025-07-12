declare interface Env {
  readonly NG_APP_USERNAME: string;
  readonly NG_APP_PASSWORD: string;

  [key: string]: any;
}

declare interface ImportMeta {
  readonly env: Env;
}
