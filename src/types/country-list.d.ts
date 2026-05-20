declare module 'country-list' {
  export interface CountryListEntry {
    code: string;
    name: string;
  }

  export function getCode(name: string): string | undefined;
  export function getName(code: string): string | undefined;
  export function getNames(): string[];
  export function getCodes(): string[];
  export function getData(): CountryListEntry[];
}
