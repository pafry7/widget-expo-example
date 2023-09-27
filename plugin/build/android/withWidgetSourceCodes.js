"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWidgetSourceCodes = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const withWidgetSourceCodes = (config, { widgetName, appGroupName }) => {
  return (0, config_plugins_1.withDangerousMod)(config, [
    "android",
    async (newConfig) => {
      const projectRoot = newConfig.modRequest.projectRoot;
      const platformRoot = newConfig.modRequest.platformProjectRoot;
      const widgetDir = path_1.default.join(projectRoot, widgetName);
      await copyResourceFiles(widgetDir, platformRoot);
      const packageName = config.android?.package;
      prepareSourceCodes(
        widgetDir,
        platformRoot,
        packageName,
        widgetName,
        appGroupName
      );
      return newConfig;
    },
  ]);
};
exports.withWidgetSourceCodes = withWidgetSourceCodes;
async function copyResourceFiles(widgetSourceDir, platformRoot) {
  const source = path_1.default.join(
    widgetSourceDir,
    "android",
    "src",
    "main",
    "res"
  );
  const resDest = path_1.default.join(
    platformRoot,
    "app",
    "src",
    "main",
    "res"
  );
  if (!fs_1.default.existsSync(widgetSourceDir)) {
    const templateFolder = path_1.default.join(__dirname, "static", "res");
    await fs_1.default.promises.cp(templateFolder, source, { recursive: true });
  }
  await fs_1.default.promises.cp(source, resDest, { recursive: true });
}
async function prepareSourceCodes(
  widgetSourceDir,
  platformRoot,
  packageName,
  widgetClassName,
  appGroupName
) {
  const packageDirPath = packageName.replace(/\./g, "/");
  const source = path_1.default.join(
    widgetSourceDir,
    `android/src/main/java/package_name`
  );
  const widgetSourceFilePath = path_1.default.join(
    source,
    `${widgetClassName}.kt`
  );
  if (!fs_1.default.existsSync(source)) {
    const templateFolder = path_1.default.join(
      __dirname,
      "static",
      "java/package_name"
    );
    await fs_1.default.promises.cp(templateFolder, source, { recursive: true });
    await fs_1.default.promises.rename(
      path_1.default.join(source, "SampleWidget.kt"),
      widgetSourceFilePath
    );
    const content = fs_1.default.readFileSync(widgetSourceFilePath, "utf8");
    let newContent = content.replace(/SampleWidget/, `${widgetClassName}`);
    newContent = newContent.replace(
      /group.com.example.widget/,
      `${appGroupName}`
    );
    fs_1.default.writeFileSync(widgetSourceFilePath, newContent);
  }
  const dest = path_1.default.join(
    platformRoot,
    "app/src/main/java",
    packageDirPath
  );
  const widgetDestFilePath = path_1.default.join(dest, `${widgetClassName}.kt`);
  await fs_1.default.promises.cp(source, dest, { recursive: true });
  const content = fs_1.default.readFileSync(widgetDestFilePath, "utf8");
  const newContent = content.replace(
    /^package .*\s/,
    `package ${packageName}\n`
  );
  fs_1.default.writeFileSync(widgetDestFilePath, newContent);
}
