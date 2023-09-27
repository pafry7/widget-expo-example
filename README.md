# widget-expo-example

Example Expo managed project with widget, module to control it and config plugin

### Steps to reproduce
1. Create expo project
```
npx create-expo-app <your_app_name>
```
2. Install `expo-dev-client`
 ```
npx expo install expo-dev-client
 ```
3. Add local expo modules
```
npx create-expo-module@latest --local
```
4 Remove unnecessary files (web and views) from `modules/<module_name>/ios` and `modules/<module_name>/android`
5. Copy source code from `modules/widget/android/src/main/java/expo/modules/widget/WidgetModule.kt`, `modules/widget/ios/WidgetModule.swift` and `modules/widget/index.ts`
6. Copy `plugin` folder
7. Copy `app.plugin.js`
8. Update `app.json` and add apple team id in `devTeamId` property
9. Run 
```
npx expo prebuild
```
14. Run
```
npx expo run:ios
```
 or
 ```
 npx expo run:android
```

### Working with the plugin
To run it, you only need the `build` folder. If you want to edit the plugin files, you need to rebuild the plugin with `https://www.npmjs.com/package/expo-module-scripts` package or your own command.
