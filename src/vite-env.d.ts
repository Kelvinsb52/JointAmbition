declare module '*.webp' {
  const source: string;
  export default source;
}

declare module '*.css' {
  const stylesheet: Record<string, string>;
  export default stylesheet;
}
