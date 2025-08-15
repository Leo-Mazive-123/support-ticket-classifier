// src/types/json.d.ts

declare module "*.json" {
  const value: { [key: string]: unknown } | unknown[];
  export default value;
}
