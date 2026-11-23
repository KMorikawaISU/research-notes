// Render Quartz's content index with public D3 APIs. All note data stays on this site.
type Note = { title?: string; links?: string[] }
type GraphNode = {
  id: string
  title: string
  x: number
  y: number
  fx?: number | null
  fy?: number | null
}
type GraphLink = { source: string | GraphNode; target: string | GraphNode }
declare const fetchData: Promise<Record<string, Note>>

// Quartz's standard graph also loads D3 from jsDelivr. The URL contains library code, not notes.
const d3Url = "https://cdn.jsdelivr.net/npm/d3@7/+esm"
const d3Ready = import(d3Url)
let generation = 0
let disposeGraphs = () => {}

function normalizeSlug(slug: string): string {
  const value = slug
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.html$/, "")
    .replace(/\/index$/, "")
  return value === "" || value === "index" ? "index" : value
}

function noteUrl(id: string): string {
  const base = document.body.dataset.basepath ?? ""
  return `${base}/${id === "index" ? "" : id.split("/").map(encodeURIComponent).join("/")}`
}

function drawGraph(container: HTMLElement, index: Record<string, Note>, d3: any): () => void {
  const options = JSON.parse(container.dataset.cfg ?? "{}")
  const current = normalizeSlug(document.body.dataset.slug ?? "index")
  const entries = Object.entries(index).filter(([id]) => id !== "tags" && !id.startsWith("tags/"))
  const nodes: GraphNode[] = entries.map(([id, note], i) => ({
    id: normalizeSlug(id),
    title: note.title ?? id,
    x: entries.length === 2 ? (i - 0.5) * 180 : Math.cos((i / entries.length) * Math.PI * 2) * 100,
    y: entries.length === 2 ? 0 : Math.sin((i / entries.length) * Math.PI * 2) * 100,
  }))
  const ids = new Set(nodes.map((node) => node.id))
  const links: GraphLink[] = []
  const seen = new Set<string>()
  for (const [rawId, note] of entries) {
    const source = normalizeSlug(rawId)
    for (const rawTarget of note.links ?? []) {
      const target = normalizeSlug(rawTarget)
      const pair = JSON.stringify([source, target].sort())
      if (ids.has(target) && source !== target && !seen.has(pair)) {
        seen.add(pair)
        links.push({ source, target })
      }
    }
  }

  container.replaceChildren()
  const svg = d3
    .select(container)
    .append("svg")
    .attr("role", "group")
    .attr("aria-label", "Research notes graph. Select a named node to open its note.")
  const layer = svg.append("g")
  const edge = layer
    .append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("class", "notebook-link")
  const node = layer
    .append("g")
    .selectAll("a")
    .data(nodes)
    .join("a")
    .attr("class", (item: GraphNode) => `notebook-node${item.id === current ? " current" : ""}`)
    .attr("data-node-id", (item: GraphNode) => item.id)
    .attr("href", (item: GraphNode) => noteUrl(item.id))
    .attr("data-router-ignore", "true")
    .attr("tabindex", 0)
    .attr("aria-label", (item: GraphNode) => item.title)
  node.append("circle").attr("r", 7)
  node
    .append("text")
    .attr("text-anchor", "middle")
    .attr("y", -16)
    .attr("font-size", (options.fontSize ?? 1) * 15)
    .text((item: GraphNode) => item.title)
  node.append("title").text((item: GraphNode) => item.title)
  // Give the label, circle, and the gap between them one continuous click/drag target.
  node.each(function (this: SVGAElement) {
    const bounds = this.getBBox()
    d3.select(this)
      .insert("rect", ":first-child")
      .attr("class", "notebook-hit-target")
      .attr("x", bounds.x - 6)
      .attr("y", bounds.y - 6)
      .attr("width", bounds.width + 12)
      .attr("height", bounds.height + 12)
      .attr("fill", "transparent")
      .attr("pointer-events", "all")
  })

  function navigate(event: MouseEvent | KeyboardEvent, item: GraphNode) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return
    event.preventDefault()
    const url = new URL(noteUrl(item.id), location.origin)
    if (window.spaNavigate) void window.spaNavigate(url)
    else location.assign(url.href)
  }
  node.on("click", navigate).on("keydown", (event: KeyboardEvent, item: GraphNode) => {
    if (event.key === "Enter" || event.key === " ") navigate(event, item)
  })

  const linkForce = d3
    .forceLink(links)
    .id((item: GraphNode) => item.id)
    .distance(options.linkDistance ?? 180)
  const simulation = d3
    .forceSimulation(nodes)
    .force("link", linkForce)
    .force("charge", d3.forceManyBody().strength(-150 * (options.repelForce ?? 0.8)))
    .force("center", d3.forceCenter(0, 0))
    .force("collide", d3.forceCollide(28))
    .on("tick", () => {
      edge
        .attr("x1", (item: any) => item.source.x)
        .attr("y1", (item: any) => item.source.y)
        .attr("x2", (item: any) => item.target.x)
        .attr("y2", (item: any) => item.target.y)
      node.attr("transform", (item: GraphNode) => `translate(${item.x},${item.y})`)
    })

  let width = 400
  let height = 360
  const zoom = d3
    .zoom()
    .scaleExtent([0.35, 4])
    .extent(() => [
      [-width / 2, -height / 2],
      [width / 2, height / 2],
    ])
    .filter(
      (event: any) =>
        (!event.ctrlKey || event.type === "wheel") &&
        !event.button &&
        (event.type === "wheel" || !(event.target as Element).closest(".notebook-node")),
    )
    .on("zoom", (event: any) => layer.attr("transform", event.transform))
  svg.call(zoom)
  node.call(
    d3
      .drag()
      .container(layer.node())
      .clickDistance(5)
      .on("start", (event: any, item: GraphNode) => {
        if (!event.active) simulation.alphaTarget(0.2).restart()
        item.fx = item.x
        item.fy = item.y
      })
      .on("drag", (event: any, item: GraphNode) => {
        item.fx = event.x
        item.fy = event.y
      })
      .on("end", (event: any, item: GraphNode) => {
        if (!event.active) simulation.alphaTarget(0)
        item.fx = null
        item.fy = null
      }),
  )

  function resize() {
    width = Math.max(container.clientWidth, 1)
    height = Math.max(container.clientHeight, 1)
    svg.attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
    linkForce.distance(Math.min(options.linkDistance ?? 180, Math.max(80, width * 0.5)))
    simulation.alpha(0.25).restart()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(container)
  resize()
  return () => {
    observer.disconnect()
    simulation.stop()
    svg.on(".zoom", null)
    node.on(".drag", null).on("click", null).on("keydown", null)
    svg.remove()
  }
}

async function renderNotebookGraphs() {
  const ticket = ++generation
  disposeGraphs()
  disposeGraphs = () => {}
  const roots = [...document.querySelectorAll<HTMLElement>(".graph")]
  if (roots.length === 0) return
  try {
    const [d3, index] = await Promise.all([d3Ready, fetchData])
    if (ticket !== generation) return
    const cleanup: (() => void)[] = []
    const closers: (() => void)[] = []
    const toggles: (() => void)[] = []
    for (const root of roots) {
      const local = root.querySelector<HTMLElement>(".graph-container")
      if (local) cleanup.push(drawGraph(local, index, d3))
      const button = root.querySelector<HTMLButtonElement>(".global-graph-icon")
      const outer = root.querySelector<HTMLElement>(".global-graph-outer")
      const global = root.querySelector<HTMLElement>(".global-graph-container")
      if (!button || !outer || !global) continue
      const sidebar = root.closest<HTMLElement>(".sidebar")
      let destroyGlobal: (() => void) | undefined
      function close() {
        destroyGlobal?.()
        destroyGlobal = undefined
        outer!.classList.remove("active")
        button!.setAttribute("aria-expanded", "false")
        if (sidebar) sidebar.style.zIndex = ""
      }
      function toggle() {
        if (outer!.classList.contains("active")) {
          close()
          return
        }
        outer!.classList.add("active")
        button!.setAttribute("aria-expanded", "true")
        if (sidebar) sidebar.style.zIndex = "2"
        destroyGlobal = drawGraph(global!, index, d3)
      }
      function outside(event: MouseEvent) {
        if (event.target === outer) close()
      }
      button.setAttribute("aria-expanded", "false")
      button.addEventListener("click", toggle)
      outer.addEventListener("click", outside)
      closers.push(close)
      toggles.push(toggle)
      cleanup.push(() => {
        close()
        button.removeEventListener("click", toggle)
        outer.removeEventListener("click", outside)
      })
    }
    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape") closers.forEach((close) => close())
      if ((event.ctrlKey || event.metaKey) && event.key === "g") {
        event.preventDefault()
        toggles[0]?.()
      }
    }
    document.addEventListener("keydown", keyboard)
    cleanup.push(() => document.removeEventListener("keydown", keyboard))
    disposeGraphs = () => cleanup.forEach((dispose) => dispose())
  } catch (error) {
    if (ticket !== generation) return
    console.error("[Notebook graph]", error)
    roots.forEach((root) => {
      const container = root.querySelector(".graph-container")
      if (container)
        container.textContent = "The graph could not load. Open notes from the sidebar."
    })
  }
}

document.addEventListener("prenav", () => {
  ++generation
  disposeGraphs()
  disposeGraphs = () => {}
})
document.addEventListener("nav", renderNotebookGraphs)
document.addEventListener("render", renderNotebookGraphs)
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", renderNotebookGraphs, { once: true })
else void renderNotebookGraphs()
