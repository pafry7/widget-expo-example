import { ConfigPlugin } from "@expo/config-plugins";
interface Props {
    appGroupIdentifier: string;
    targetName: string;
}
export declare const withWidgetEntitlements: ConfigPlugin<Props>;
export {};
