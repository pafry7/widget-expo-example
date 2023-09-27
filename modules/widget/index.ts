import WidgetModule from "./src/WidgetModule";

export function reloadAll(): void {
  return WidgetModule.reloadAll();
}
export function setItem(appGroup: string, key: string, value: any): void;
export function setItem(
  appGroup: string,
  key?: string,
  value?: any
): (key: string, value: any) => void;

export function setItem(appGroup: string, key?: string, value?: any) {
  if (typeof key !== "undefined" && typeof value !== "undefined") {
    return WidgetModule.setItem(value, key, appGroup);
  }
  return (key: string, value: any) =>
    WidgetModule.setItem(value, key, appGroup);
}

export function getItem(appGroup: string, key: string): string;
export function getItem(
  appGroup: string,
  key?: string
): (key: string) => string;

export function getItem(appGroup: string, key?: string) {
  if (typeof key !== "undefined") {
    return WidgetModule.getItem(key, appGroup);
  }
  return (key: string) => WidgetModule.getItem(key, appGroup);
}
