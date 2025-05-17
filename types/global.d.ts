declare global {
  interface Window {
    FileReader: typeof FileReader;
  }

  var FileReader: {
    new(): FileReader;
    prototype: FileReader;
    readonly EMPTY: 0;
    readonly LOADING: 1;
    readonly DONE: 2;
  };

  interface FileReader {
    onload: (() => void) | null;
    result: string | ArrayBuffer | null;
    readAsDataURL(file: Blob): void;
    readonly EMPTY: 0;
    readonly LOADING: 1;
    readonly DONE: 2;
  }
}

export {};
