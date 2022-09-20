const DATA_PATH = "./iris.csv";

class ScatterChart {
  constructor(data, layout, axes) {
    this.data = data;
    this.layout = layout;
    this.innerWidth = this.layout.width - this.layout.margin.left - this.layout.margin.right;
    this.innerHeight = this.layout.height - this.layout.margin.top - this.layout.margin.bottom;
    this.axes = axes;
    this.render();
  }
  get xValue() {
    return (d) => d[this.axes.x];
  }
  get yValue() {
    return (d) => d[this.axes.y];
  }
  get xDomain() {
    return this.axes.xZero
      ? [0, d3.max(this.data.map(this.xValue))]
      : d3.extent(this.data.map(this.xValue));
  }
  get yDomain() {
    return this.axes.yZero
      ? [0, d3.max(this.data.map(this.yValue))]
      : d3.extent(this.data.map(this.yValue));
  }
  render() {
    const { width, height, margin, palette } = this.layout;
    const plotContainer = d3
      .select("svg#plot-container")
      .attr("width", width)
      .attr("height", height);
    const legendContainer = d3.select("svg#plot-legend");
    this.xScale = d3.scaleLinear().domain(this.xDomain).nice().range([0, this.innerWidth]);
    this.yScale = d3.scaleLinear().domain(this.yDomain).nice().range([this.innerHeight, 0]);
    const cScale = d3
      .scaleOrdinal()
      .domain(this.data.map((d) => d["class"]))
      .range(palette);
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
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .text("Iris distribution");
    // draw X AXIS, LABEL and GRID LINES
    this.plot
      .append("g")
      .call(d3.axisBottom(this.xScale))
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${this.innerHeight})`);
    this.plot
      .append("text")
      .attr("id", "x-label")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${this.innerWidth / 2}, ${this.innerHeight + 40})`)
      .text(this.axes.x);
    this.plot
      .append("g")
      .attr("opacity", "0.1")
      .attr("transform", "translate(0," + this.innerHeight + ")")
      .call(d3.axisBottom(this.xScale).tickSize(-this.innerHeight).tickFormat(""));
    // draw Y AXIS, LABEL and GRID LINES
    this.plot.append("g").call(d3.axisLeft(this.yScale)).attr("id", "y-axis");
    this.plot
      .append("text")
      .attr("id", "y-label")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${-40}, ${this.innerHeight / 2}) rotate(270)`)
      .text(this.axes.y);
    this.plot
      .append("g")
      .attr("opacity", "0.1")
      .call(d3.axisLeft(this.yScale).tickSize(-this.innerWidth).tickFormat(""));
    // draw circles, DATA POINT
    this.plot
      .selectAll("circle")
      .data(this.data)
      .join("circle")
      .attr("cx", (d) => this.xScale(this.xValue(d)))
      .attr("cy", (d) => this.yScale(this.yValue(d)))
      .attr("fill", (d) => cScale(d["class"]))
      .attr("stroke", "white")
      .attr("stroke-width", "1px")
      .attr("opacity", 0.7)
      .attr("r", 6);
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
  update() {
    this.xScale.domain(this.xDomain).nice();
    this.yScale.domain(this.yDomain).nice();
    const t = d3.transition().duration(1000);
    this.plot.select("#x-axis").transition(t).call(d3.axisBottom(this.xScale));
    this.plot.select("#y-axis").transition(t).call(d3.axisLeft(this.yScale));
    this.plot.select("#x-label").text(this.axes.x);
    this.plot.select("#y-label").text(this.axes.y);
    this.plot
      .selectAll("circle")
      .data(this.data)
      .join("circle", (update) =>
        update
          .transition(t)
          .attr("cx", (d) => this.xScale(this.xValue(d)))
          .attr("cy", (d) => this.yScale(this.yValue(d)))
      );
  }
}

async function main() {
  const dataset = await d3.csv(DATA_PATH);
  const layout = {
    width: 800,
    height: 400,
    margin: { left: 50, right: 50, top: 50, bottom: 50 },
    palette: ["#003f5c", "#bc5090", "#ffa600"],
  };
  const axes = {
    x: d3.select("#x-attr-select").node().value,
    y: d3.select("#y-attr-select").node().value,
    xZero: false,
    yZero: false,
  };
  // ************ NOTE: PASS BY REFERENCE ************
  const chart = new ScatterChart(dataset, layout, axes);
  d3.select("#x-attr-select").on("change", (event) => {
    axes.x = event.target.value;
    chart.update();
  });
  d3.select("#y-attr-select").on("change", (event) => {
    axes.y = event.target.value;
    chart.update();
  });
  d3.select("#x-zero").on("change", () => {
    axes.xZero = !axes.xZero;
    chart.update();
  });
  d3.select("#y-zero").on("change", () => {
    axes.yZero = !axes.yZero;
    chart.update();
  });
}
main();
