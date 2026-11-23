import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"
import notebookGraph from "./quartz/components/scripts/notebook-graph.inline"

const config = await loadQuartzConfig()
const components = componentRegistry.getAllComponents()

// Keep Quartz's Graph markup and options; use a readable SVG renderer for this notebook.
const graph = components.find((component) => component.name === "Graph")
if (graph) graph.afterDOMLoaded = notebookGraph

// Start new visitors in dark mode, while honoring an existing explicit preference.
const darkmode = components.find((component) => component.name === "Darkmode")
if (darkmode && typeof darkmode.beforeDOMLoaded === "string") {
  darkmode.beforeDOMLoaded =
    'if (localStorage.getItem("theme") === null) localStorage.setItem("theme", "dark");\n' +
    darkmode.beforeDOMLoaded
}

export default config
// Rebuild grouped resources and update the renderer after the component overrides.
export const layout = await loadQuartzLayout({})
