declare module "@toast-ui/editor" {
  export interface EditorOptions {
    el: HTMLElement;
    height?: string;
    minHeight?: string;
    initialValue?: string;
    initialEditType?: "markdown" | "wysiwyg";
    previewStyle?: "vertical" | "tab";
    hideModeSwitch?: boolean;
    placeholder?: string;
    usageStatistics?: boolean;
    autofocus?: boolean;
    theme?: string;
    toolbarItems?: ReadonlyArray<ReadonlyArray<string>>;
    hooks?: {
      addImageBlobHook?: (
        blob: Blob | File,
        callback: (url: string, text?: string) => void,
      ) => void | Promise<void>;
    };
    events?: {
      change?: () => void;
    };
  }

  export class Editor {
    constructor(options: EditorOptions);
    getMarkdown(): string;
    setMarkdown(markdown: string, cursorToEnd?: boolean): void;
    destroy(): void;
  }

  export default Editor;
}
