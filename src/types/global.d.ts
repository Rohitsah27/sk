// Replace the existing global declaration with this corrected version
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: {
          new (options: any, element: string): void;
          InlineLayout: {
            SIMPLE: number;
            HORIZONTAL: number;
            VERTICAL: number;
          };
        };
      };
    };
  }
}