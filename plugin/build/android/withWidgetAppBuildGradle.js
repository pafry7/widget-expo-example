"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWidgetAppBuildGradle = void 0;
const config_plugins_1 = require("@expo/config-plugins");
/**
 * Add "apply plugin: kotlin-android" to app build.gradle
 * @param config
 * @returns
 */
const withWidgetAppBuildGradle = (config) => {
    return (0, config_plugins_1.withAppBuildGradle)(config, async (newConfig) => {
        const buildGradle = newConfig.modResults.contents;
        const search = /(apply plugin: "com\.android\.application"\n)/gm;
        const replace = `$1apply plugin: "kotlin-android"\n`;
        let newBuildGradle = buildGradle.replace(search, replace);
        newBuildGradle = newBuildGradle.replace(/dependencies\s?{/, `dependencies {
    implementation 'com.google.code.gson:gson:2.10.1'`);
        newConfig.modResults.contents = newBuildGradle;
        return newConfig;
    });
};
exports.withWidgetAppBuildGradle = withWidgetAppBuildGradle;
