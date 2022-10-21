const DATA_PATH = "../dataset/iris.csv";
// used for uploaded homework
// const DATA_PATH = "http://vis.lab.djosix.com:2020/data/iris.csv";

class ParallelCoordinate {
  constructor(data, layout, axes) {
    this.data = data;
    this.layout = layout;
    this.innerWidth = this.layout.width - this.layout.margin.left - this.layout.margin.right;
    this.innerHeight = this.layout.height - this.layout.margin.top - this.layout.margin.bottom;
    this.axes = axes;
    this.render();
  }
  render() {
    const { width, height, margin, palette } = this.layout;
    const plotContainer = d3
      .select("svg#plot-container")
      .attr("width", width)
      .attr("height", height);
    const legendContainer = d3.select("svg#plot-legend").attr("width", 150);
    const xScale = d3.scalePoint().domain(this.axes).range([0, this.innerWidth]);
    const yScale = new Map(
      this.axes.map((axis) => [
        axis,
        d3
          .scaleLinear()
          .domain(d3.extent(this.data.map((d) => d[axis])))
          .nice()
          .range([this.innerHeight, 0]),
      ])
    );
    const cScale = d3
      .scaleOrdinal()
      .domain(this.data.map((d) => d["class"]))
      .range(palette);
    const xDragging = {};
    const xDraggingOrScale = (d) => xDragging[d] || xScale(d);
    const line = d3
      .line()
      .defined(([, value]) => value != null)
      .x(([key]) => xDragging[key] || xScale(key))
      .y(([key, value]) => yScale.get(key)(value));
    const label = (d) => d;
    // create plot body (<g>) in plotContainer (<svg>)
    plotContainer
      .selectAll("g#plot")
      .data([null])
      .enter()
      .append("g")
      .attr("id", "plot")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    this.plot = plotContainer.select("g#plot");
    // draw TITLE
    this.plot
      .selectAll("text#title")
      .data([null])
      .enter()
      .append("text")
      .attr("id", "title")
      .attr("x", this.innerWidth / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .text("Iris distribution");

    const path = this.plot
      .append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.6)
      .selectAll("path")
      .data(this.data)
      .join("path")
      .attr("stroke", (d) => cScale(d))
      .attr("d", (d) => line(d3.cross(this.axes, [d], (key, d) => [key, d[key]])));

    path.append("title").text(label);

    // draw AXES and listening DRAG
    const axes = this.plot
      .append("g")
      .selectAll("g")
      .data(this.axes)
      .join("g")
      .attr("transform", (d) => `translate(${xScale(d)}, 0)`)
      .call(
        d3
          .drag()
          .on("start", (_, d) => {
            xDragging[d] = xScale(d);
          })
          .on("drag", (event, d) => {
            xDragging[d] = Math.min(
              width,
              Math.max(-margin.left, d3.pointer(event, this.plot.node())[0])
            );
            path.attr("d", (d) => line(d3.cross(this.axes, [d], (key, d) => [key, d[key]])));
            this.axes.sort((a, b) => xDraggingOrScale(a) - xDraggingOrScale(b));
            xScale.domain(this.axes);
            axes.attr("transform", (d) => `translate(${xDraggingOrScale(d)})`);
          })
          .on("end", (_, d) => {
            delete xDragging[d];
            axes.attr("transform", (d) => `translate(${xScale(d)})`);
            path.attr("d", (d) => line(d3.cross(this.axes, [d], (key, d) => [key, d[key]])));
          })
      );

    // apply AXES
    axes
      .each(function (d) {
        d3.select(this)
          .call(d3.axisRight(yScale.get(d)))
          .style("cursor", "move");
      })
      .call((g) =>
        g
          .append("text")
          .attr("x", 0)
          .attr("y", -10)
          .attr("text-anchor", "middle")
          .attr("fill", "currentColor")
          .style("cursor", "move")
          .text((d) => d)
      )
      .call((g) =>
        g
          .selectAll("text")
          .clone(true)
          .lower()
          .attr("fill", "none")
          .attr("stroke-width", 5)
          .attr("stroke-linejoin", "round")
          .attr("stroke", "white")
      );

    // draw LEGENDS
    legendContainer
      .selectAll("circle")
      .data([...new Set(this.data.map((d) => d["class"]))])
      .enter()
      .append("circle")
      .attr("cx", 6)
      .attr("cy", (_, i) => 15 + i * 25)
      .attr("fill", (d) => cScale(d))
      .attr("r", 6);
    legendContainer
      .selectAll("text")
      .data([...new Set(this.data.map((d) => d["class"]))])
      .enter()
      .append("text")
      .attr("x", 18)
      .attr("y", (_, i) => 15 + i * 25)
      .style("alignment-baseline", "middle")
      .text((d) => d);
  }
}

async function main() {
  const raw = await d3.csv(DATA_PATH);
  const axes = raw.columns.filter((d) => d !== "class");
  const dataset = raw.filter((d) => d["class"] !== "");
  const layout = {
    width: 800,
    height: 480,
    margin: { left: 50, right: 50, top: 70, bottom: 50 },
    palette: ["#003f5c", "#bc5090", "#ffa600"],
  };
  // ************ NOTE: PASS BY REFERENCE ************
  const chart = new ParallelCoordinate(dataset, layout, axes);
}

main();
