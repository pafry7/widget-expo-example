import { ConfigPlugin } from "@expo/config-plugins";
interface Props {
    targetName: string;
    devTeamId: string;
    topLevelFiles: string[];
}
export declare function quoted(str: string): string;
export declare const withWidgetXcodeTarget: ConfigPlugin<Props>;
export {};
