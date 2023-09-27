package expo.modules.widget

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager



class WidgetModule : Module() {
  override fun definition() = ModuleDefinition {
  // Sets the name of the module that JavaScript code will use to refer to the module. Takes a
  // string as an argument.
  // Can be inferred from module's class name, but it's recommended to set it explicitly for
  // clarity.
  // The module will be accessible from `requireNativeModule('RefreshWidget')` in JavaScript.
  Name("Widget")

  // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
  Function("reloadAll") {
    val widgetName = getWidgetName()
    if (widgetName == null) {
      throw Exception("Couldn't read widgetName from app.json")
    }
    val widgetComponentName = getWidgetComponentName(widgetName)
    if (widgetComponentName == null) {
      throw Exception("Couldn't find widgetName component name")
    }
    val widgetManager = AppWidgetManager.getInstance(context)
    val appWidgetIds = widgetManager.getAppWidgetIds(widgetComponentName)

    val updateIntent =
        Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE, null).setComponent(widgetComponentName)
    updateIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds)

    context.sendBroadcast(updateIntent)
  }
  Function("setItem") { value: String, key: String, appGroup: String ->
    getPreferences(appGroup).edit().putString(key, value).commit()
  }

  Function("getItem") { key: String, appGroup: String ->
    return@Function getPreferences(appGroup).getString(key, "")
  }
}

private val context
  get() = requireNotNull(appContext.reactContext)

private fun getPreferences(appGroup: String): SharedPreferences {
  return context.getSharedPreferences(appGroup, Context.MODE_PRIVATE)
}

private fun getWidgetName(): String? {
  val applicationInfo =
      context.packageManager?.getApplicationInfo(
          context.packageName.toString(),
          PackageManager.GET_META_DATA
      )
  return applicationInfo?.metaData?.getString("WIDGET_NAME")
}

private fun getWidgetComponentName(widgetName: String): ComponentName? {
  val widgetList = AppWidgetManager.getInstance(context).getInstalledProviders()
  for (providerInfo in widgetList) {
    if (providerInfo.provider.getPackageName().equals(context.getPackageName()) &&
            providerInfo.provider.getShortClassName().endsWith("." + widgetName)
    ) {
      return providerInfo.provider
    }
  }

  return null
}

}
