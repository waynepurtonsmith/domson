import type { Cheerio } from 'cheerio';
import type { AnyNode } from 'domhandler';
export type Element = Cheerio<AnyNode>;
export type Schema<T> = string | ((el: Element) => T) | {
    [K in keyof T]: Schema<T[K]>;
} | [string, (el: Element) => Schema<T extends Array<infer U> ? U : never>];
