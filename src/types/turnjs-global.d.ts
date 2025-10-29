declare module 'jquery' {
  const $: any;
  export default $;
}

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

export {};


