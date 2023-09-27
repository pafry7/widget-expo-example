"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWidgetSourceFiles = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const withWidgetSourceFiles = (config, { targetName, appGroupIdentifier }) => {
    return (0, config_plugins_1.withXcodeProject)(config, async (config) => {
        const extensionRootPath = path.join(config.modRequest.platformProjectRoot, targetName);
        const projectPath = config.modRequest.projectRoot;
        const widgetSourceDirPath = path.join(projectPath, targetName, "ios");
        if (!fs.existsSync(widgetSourceDirPath)) {
            await fs.promises.mkdir(widgetSourceDirPath, { recursive: true });
            const widgetStaticSourceDirPath = path.join(__dirname, "static");
            await fs.promises.copyFile(path.join(widgetStaticSourceDirPath, "widget.swift"), path.join(widgetSourceDirPath, "widget.swift"));
            await fs.promises.cp(path.join(widgetStaticSourceDirPath, "Assets.xcassets"), path.join(widgetSourceDirPath, "Assets.xcassets"), { recursive: true });
            const widgetSourceFilePath = path.join(widgetSourceDirPath, "widget.swift" // use to targetName
            );
            const content = fs.readFileSync(widgetSourceFilePath, "utf8");
            const newContent = content.replace(/group.com.example.widget/, `${appGroupIdentifier}`);
            fs.writeFileSync(widgetSourceFilePath, newContent);
        }
        await fs.promises.mkdir(extensionRootPath, { recursive: true });
        await fs.promises.copyFile(path.join(widgetSourceDirPath, "widget.swift"), path.join(extensionRootPath, "widget.swift"));
        await fs.promises.cp(path.join(widgetSourceDirPath, "Assets.xcassets"), path.join(extensionRootPath, "Assets.xcassets"), { recursive: true });
        const proj = config.modResults;
        const targetUuid = proj.findTargetKey(targetName);
        const groupUuid = proj.findPBXGroupKey({ name: targetName });
        if (!targetUuid) {
            return Promise.reject(null);
        }
        if (!groupUuid) {
            return Promise.reject(null);
        }
        proj.addSourceFile("widget.swift", {
            target: targetUuid,
        }, groupUuid);
        return config;
    });
};
exports.withWidgetSourceFiles = withWidgetSourceFiles;
