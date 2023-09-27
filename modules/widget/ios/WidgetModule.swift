import ExpoModulesCore

import WidgetKit

internal class VersionException: Exception {
    override var reason: String {
        "Function is available only on iOS 14 and higher"
    }
}


public class WidgetModule: Module {
      public func definition() -> ModuleDefinition {
        Name("Widget")
        
        Function("reloadAll") { () -> Void in
            if #available(iOS 14, *) {
                WidgetCenter.shared.reloadAllTimelines()
            } else {
                throw VersionException()
            }
        }
        
        Function("setItem") { (value: String, key: String, appGroup: String) -> Void in
            if let userDefaults = UserDefaults(suiteName: appGroup){
                userDefaults.set(value, forKey: key )
            }
        }
        
        Function("getItem") { ( key: String, appGroup: String) -> String? in
            if let userDefaults = UserDefaults(suiteName: appGroup){
                return userDefaults.string(forKey: key)
            }
            return nil
        }
        
    }
}
