// Minimal axios shim for TypeScript when axios is not installed in the environment.
// Provides a very small, conservative declaration using `unknown` to avoid lint errors.
declare module 'axios' {
  const axios: unknown;
  export default axios;
}
