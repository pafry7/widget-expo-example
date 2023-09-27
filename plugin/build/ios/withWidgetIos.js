"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWidgetIos = exports.DEFAULT_TOP_LEVEL_FILES = exports.DEFAULT_WIDGET_TARGET_NAME = void 0;
const withWidgetEntitlements_1 = require("./withWidgetEntitlements");
const withWidgetSourceFiles_1 = require("./withWidgetSourceFiles");
const withWidgetPlist_1 = require("./withWidgetPlist");
const withWidgetXcodeTarget_1 = require("./withWidgetXcodeTarget");
// make defaults
exports.DEFAULT_WIDGET_TARGET_NAME = "widget";
exports.DEFAULT_TOP_LEVEL_FILES = ["Assets.xcassets", "widget.swift"];
const withWidgetIos = (config, { widgetName, ios }) => {
    const { appGroupIdentifier, devTeamId } = ios;
    const targetName = widgetName ?? exports.DEFAULT_WIDGET_TARGET_NAME;
    const topLevelFiles = ios.topLevelFiles ?? exports.DEFAULT_TOP_LEVEL_FILES;
    config = (0, withWidgetEntitlements_1.withWidgetEntitlements)(config, { targetName, appGroupIdentifier });
    config = (0, withWidgetSourceFiles_1.withWidgetSourceFiles)(config, { targetName, appGroupIdentifier });
    config = (0, withWidgetPlist_1.withWidgetPlist)(config, { targetName });
    config = (0, withWidgetXcodeTarget_1.withWidgetXcodeTarget)(config, {
        devTeamId,
        targetName,
        topLevelFiles,
    });
    return config;
};
exports.withWidgetIos = withWidgetIos;
