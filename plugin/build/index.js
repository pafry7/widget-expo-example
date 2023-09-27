"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withWidgetAndroid_1 = require("./android/withWidgetAndroid");
const withWidgetIos_1 = require("./ios/withWidgetIos");
const withAppConfigs = (config, options) => {
    return (0, config_plugins_1.withPlugins)(config, [
        [withWidgetAndroid_1.withWidgetAndroid, options],
        [withWidgetIos_1.withWidgetIos, options],
    ]);
};
exports.default = withAppConfigs;
