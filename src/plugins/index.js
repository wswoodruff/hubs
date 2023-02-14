import devPlugins from "./devPlugins";
import prodPlugins from "./prodPlugins";
import configs from "../utils/configs";

const RUN_DEV_PLUGINS = configs.isLocalDevelopment;
// Negate DEV plugins. Customize to ur preference these aren't XOR
const RUN_PROD_PLUGINS = !RUN_DEV_PLUGINS;

const _plugins = {};

const validKeys = ["id", "onContext"];

export function register(store, _plugins) {
  const plugins = [].concat(_plugins);

  for (let plugin of plugins) {
    let id = plugin.id ?? plugin.name ?? plugin.pkg?.name;

    if (Object.keys(plugin).find(maybeInvalid => !validKeys.includes(maybeInvalid))) {
      throw new Error(`Invalid plugin ${id} ${JSON.stringify(plugin, null, 4)}`);
    }

    if (typeof plugin === "function") {
      // TODO want to pass options here too
      plugin = plugin(store);
      id = plugin.id ?? plugin.name ?? plugin.pkg?.name;
    }

    // Clone plugin
    // plugin = { ...plugin };

    _plugins[id] = plugin;
  }

  return _plugins;
}

export function registerDefaultPlugins(store) {
  if (RUN_DEV_PLUGINS) {
    register(store, devPlugins);
  }
  if (RUN_PROD_PLUGINS) {
    register(store, prodPlugins);
  }
}

export function get() {
  return _plugins;
}

export function unregister(id) {
  delete _plugins[id];
  return _plugins;
}

export function forEachPlugin(func) {
  return Object.values(_plugins).forEach(plugin => func(plugin));
}
