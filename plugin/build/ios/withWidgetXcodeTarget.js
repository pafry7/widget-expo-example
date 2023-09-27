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
exports.withWidgetXcodeTarget = exports.quoted = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const util = __importStar(require("util"));
const addBroadcastExtensionXcodeTarget = async (proj, { appName, extensionName, extensionBundleIdentifier, currentProjectVersion, marketingVersion, devTeamId, topLevelFiles, }) => {
    if (proj.getFirstProject().firstProject.targets?.length > 1)
        return;
    const targetUuid = proj.generateUuid();
    const groupName = "Embed App Extensions";
    const xCConfigurationList = addXCConfigurationList(proj, {
        extensionBundleIdentifier,
        currentProjectVersion,
        marketingVersion,
        extensionName,
        appName,
        devTeamId,
    });
    const productFile = addProductFile(proj, extensionName, groupName);
    const target = addToPbxNativeTargetSection(proj, {
        extensionName,
        targetUuid,
        productFile,
        xCConfigurationList,
    });
    addToPbxProjectSection(proj, target);
    addTargetDependency(proj, target);
    const frameworkFileWidgetKit = proj.addFramework("WidgetKit.framework", {
        target: target.uuid,
        link: false,
    });
    const frameworkFileSwiftUI = proj.addFramework("SwiftUI.framework", {
        target: target.uuid,
        link: false,
    });
    addBuildPhases(proj, {
        extensionName,
        groupName,
        productFile,
        targetUuid,
        frameworkPaths: [frameworkFileSwiftUI.path, frameworkFileWidgetKit.path],
    });
    addPbxGroup(proj, productFile, extensionName, topLevelFiles);
};
function quoted(str) {
    return util.format(`"%s"`, str);
}
exports.quoted = quoted;
const addXCConfigurationList = (proj, { extensionBundleIdentifier, currentProjectVersion, marketingVersion, extensionName, devTeamId, }) => {
    const commonBuildSettings = {
        ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME: "AccentColor",
        ASSETCATALOG_COMPILER_WIDGET_BACKGROUND_COLOR_NAME: "WidgetBackground",
        CLANG_ANALYZER_NONNULL: "YES",
        CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION: "YES_AGGRESSIVE",
        CLANG_CXX_LANGUAGE_STANDARD: quoted("gnu++17"),
        CLANG_ENABLE_OBJC_WEAK: "YES",
        CLANG_WARN_DOCUMENTATION_COMMENTS: "YES",
        CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER: "YES",
        CLANG_WARN_UNGUARDED_AVAILABILITY: "YES_AGGRESSIVE",
        CODE_SIGN_STYLE: "Automatic",
        CURRENT_PROJECT_VERSION: currentProjectVersion,
        DEVELOPMENT_TEAM: devTeamId,
        GCC_C_LANGUAGE_STANDARD: "gnu11",
        GENERATE_INFOPLIST_FILE: "YES",
        INFOPLIST_FILE: `${extensionName}/Info.plist`,
        INFOPLIST_KEY_CFBundleDisplayName: `${extensionName}`,
        INFOPLIST_KEY_NSHumanReadableCopyright: quoted(""),
        IPHONEOS_DEPLOYMENT_TARGET: "14.0",
        LD_RUNPATH_SEARCH_PATHS: quoted("$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks"),
        MARKETING_VERSION: marketingVersion,
        MTL_FAST_MATH: "YES",
        PRODUCT_BUNDLE_IDENTIFIER: quoted(extensionBundleIdentifier),
        PRODUCT_NAME: quoted("$(TARGET_NAME)"),
        SKIP_INSTALL: "YES",
        SWIFT_EMIT_LOC_STRINGS: "YES",
        SWIFT_VERSION: "5.0",
        TARGETED_DEVICE_FAMILY: quoted("1"),
        SWIFT_ACTIVE_COMPILATION_CONDITIONS: "DEBUG",
        SWIFT_OPTIMIZATION_LEVEL: "-Onone",
    };
    const buildConfigurationsList = [
        {
            name: "Debug",
            isa: "XCBuildConfiguration",
            buildSettings: {
                ...commonBuildSettings,
                DEBUG_INFORMATION_FORMAT: "dwarf",
                MTL_ENABLE_DEBUG_INFO: "INCLUDE_SOURCE",
                SWIFT_ACTIVE_COMPILATION_CONDITIONS: "DEBUG",
                SWIFT_OPTIMIZATION_LEVEL: quoted("-Onone"),
            },
        },
        {
            name: "Release",
            isa: "XCBuildConfiguration",
            buildSettings: {
                ...commonBuildSettings,
                COPY_PHASE_STRIP: "NO",
                DEBUG_INFORMATION_FORMAT: quoted("dwarf-with-dsym"),
                SWIFT_OPTIMIZATION_LEVEL: quoted("-Owholemodule"),
            },
        },
    ];
    const xCConfigurationList = proj.addXCConfigurationList(buildConfigurationsList, "Release", `Build configuration list for PBXNativeTarget ${quoted(extensionName)}`);
    // update other build properties
    proj.updateBuildProperty("ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES", "YES", null, proj.getFirstTarget().firstTarget.name);
    proj.updateBuildProperty("IPHONEOS_DEPLOYMENT_TARGET", "14.0");
    return xCConfigurationList;
};
const addProductFile = (proj, extensionName, groupName) => {
    const productFile = {
        basename: `${extensionName}.appex`,
        fileRef: proj.generateUuid(),
        uuid: proj.generateUuid(),
        group: groupName,
        explicitFileType: "wrapper.app-extension",
        settings: {
            ATTRIBUTES: ["RemoveHeadersOnCopy"],
        },
        includeInIndex: 0,
        path: `${extensionName}.appex`,
        sourceTree: "BUILT_PRODUCTS_DIR",
    };
    proj.addToPbxFileReferenceSection(productFile);
    proj.addToPbxBuildFileSection(productFile);
    return productFile;
};
const addToPbxNativeTargetSection = (proj, { extensionName, targetUuid, productFile, xCConfigurationList, }) => {
    const target = {
        uuid: targetUuid,
        pbxNativeTarget: {
            isa: "PBXNativeTarget",
            buildConfigurationList: xCConfigurationList.uuid,
            buildPhases: [],
            buildRules: [],
            dependencies: [],
            name: extensionName,
            productName: extensionName,
            productReference: productFile.fileRef,
            productType: quoted("com.apple.product-type.app-extension"),
        },
    };
    proj.addToPbxNativeTargetSection(target);
    return target;
};
const addToPbxProjectSection = (proj, target) => {
    proj.addToPbxProjectSection(target);
    // Add target attributes to project section
    if (!proj.pbxProjectSection()[proj.getFirstProject().uuid].attributes
        .TargetAttributes) {
        proj.pbxProjectSection()[proj.getFirstProject().uuid].attributes.TargetAttributes = {};
    }
    proj.pbxProjectSection()[proj.getFirstProject().uuid].attributes.LastSwiftUpdateCheck = 1340;
    proj.pbxProjectSection()[proj.getFirstProject().uuid].attributes.TargetAttributes[target.uuid] = {
        CreatedOnToolsVersion: "13.4.1",
        ProvisioningStyle: "Automatic",
    };
};
const addTargetDependency = (proj, target) => {
    if (!proj.hash.project.objects["PBXTargetDependency"]) {
        proj.hash.project.objects["PBXTargetDependency"] = {};
    }
    if (!proj.hash.project.objects["PBXContainerItemProxy"]) {
        proj.hash.project.objects["PBXContainerItemProxy"] = {};
    }
    proj.addTargetDependency(proj.getFirstTarget().uuid, [target.uuid]);
};
const addBuildPhases = (proj, { productFile, targetUuid, frameworkPaths, extensionName, }) => {
    const buildPath = quoted("");
    // Sources build phase
    proj.addBuildPhase([`widget.swift`], "PBXSourcesBuildPhase", "Sources", targetUuid, extensionName, buildPath);
    // Copy files build phase
    proj.addBuildPhase([productFile.path], "PBXCopyFilesBuildPhase", "Copy Files", proj.getFirstTarget().uuid, "app_extension", buildPath);
    // Frameworks build phase
    proj.addBuildPhase(frameworkPaths, "PBXFrameworksBuildPhase", "Frameworks", targetUuid, extensionName, buildPath);
    // Resources build phase
    proj.addBuildPhase(["Assets.xcassets"], "PBXResourcesBuildPhase", "Resources", targetUuid, extensionName, buildPath);
};
const addPbxGroup = (proj, productFile, extensionName, topLevelFiles) => {
    // Add PBX group
    const { uuid: pbxGroupUuid } = proj.addPbxGroup(topLevelFiles, extensionName, extensionName);
    // Add PBXGroup to top level group
    const groups = proj.hash.project.objects["PBXGroup"];
    if (pbxGroupUuid) {
        Object.keys(groups).forEach(function (key) {
            if (groups[key].name === undefined && groups[key].path === undefined) {
                proj.addToPbxGroup(pbxGroupUuid, key);
            }
            else if (groups[key].name === "Products") {
                proj.addToPbxGroup(productFile, key);
            }
        });
    }
};
const withWidgetXcodeTarget = (config, { devTeamId, targetName, topLevelFiles }) => {
    return (0, config_plugins_1.withXcodeProject)(config, async (config) => {
        const appName = config.modRequest.projectName;
        const extensionBundleIdentifier = `${config.ios.bundleIdentifier}.widget`;
        const currentProjectVersion = config.ios.buildNumber || "1";
        const marketingVersion = config.version;
        await addBroadcastExtensionXcodeTarget(config.modResults, {
            appName,
            extensionName: targetName,
            extensionBundleIdentifier,
            currentProjectVersion,
            marketingVersion,
            devTeamId,
            topLevelFiles,
        });
        return config;
    });
};
exports.withWidgetXcodeTarget = withWidgetXcodeTarget;
