"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWidgetManifest = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withWidgetManifest = (config, { widgetName }) => {
    return (0, config_plugins_1.withAndroidManifest)(config, async (newConfig) => {
        const mainApplication = config_plugins_1.AndroidConfig.Manifest.getMainApplicationOrThrow(newConfig.modResults);
        const widgetReceivers = await buildWidgetsReceivers(widgetName);
        mainApplication.receiver = widgetReceivers;
        config_plugins_1.AndroidConfig.Manifest.addMetaDataItemToMainApplication(mainApplication, "WIDGET_NAME", widgetName);
        return newConfig;
    });
};
exports.withWidgetManifest = withWidgetManifest;
async function buildWidgetsReceivers(widgetName) {
    return [
        {
            $: {
                "android:name": `.${widgetName}`,
                "android:exported": "false",
            },
            "intent-filter": [
                {
                    action: [
                        {
                            $: {
                                "android:name": "android.appwidget.action.APPWIDGET_UPDATE",
                            },
                        },
                    ],
                },
            ],
            "meta-data": [
                {
                    $: {
                        "android:name": "android.appwidget.provider",
                        "android:resource": "@xml/sample_widget_info",
                    },
                },
            ],
        },
    ];
}
