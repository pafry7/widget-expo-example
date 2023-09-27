import { ConfigPlugin } from "@expo/config-plugins";
export interface Props {
    widgetName: string;
    ios: {
        devTeamId: string;
        appGroupIdentifier: string;
        topLevelFiles?: string[];
    };
}
declare const withAppConfigs: ConfigPlugin<Props>;
export default withAppConfigs;
