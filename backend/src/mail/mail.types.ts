export interface TextEmailContents {
  text: string;
  html?: string;
}

export interface HtmlEmailContents {
  text?: string;
  html: string;
}

export type EmailContents = TextEmailContents | HtmlEmailContents;
