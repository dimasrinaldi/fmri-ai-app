import _ from "lodash";

const _process = typeof document == "undefined" ? process : undefined;
const defaultEnv = "FROM_ENV";
export const configPublic = {
  buildId: _process?.env.NODE_ENV == "production" ? _.random(100000, 999999) : 111,

  appName: _process?.env.APP_NAME || defaultEnv,
  companyName: _process?.env.COMPANY_NAME || defaultEnv,
  faviconPath: _process?.env.FAVICON_PATH || defaultEnv,
  logoPath: _process?.env.LOGO_PATH || defaultEnv,
  cssPath: _process?.env.CSS_PATH || defaultEnv,

  loginPath: _process?.env.LOGIN_PATH || defaultEnv,
  authHomePath: _process?.env.AUTH_HOME_PATH || defaultEnv,
} as const;
