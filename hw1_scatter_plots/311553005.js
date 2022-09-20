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
  render() {
    const { width, height, margin, palette } = this.layout;
    const plotContainer = d3.select("svg").attr("width", width).attr("height", height);
    this.xScale = d3
      .scaleLinear()
      // .domain([0, d3.max(this.data.map(this.xValue))])
      .domain(d3.extent(this.data.map(this.xValue)))
      .nice()
      .range([0, this.innerWidth]);
    this.yScale = d3
      .scaleLinear()
      // .domain([d3.max(this.data.map(this.yValue)), 0])
      .domain(d3.extent(this.data.map(this.yValue)))
      .nice()
      .range([this.innerHeight, 0]);
    const cScale = d3
      .scaleOrdinal()
      .domain(this.data.map((d) => d["class"]))
      .range(palette);

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

    // draw X AXIS & LABEL
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

    // draw Y AXIS & LABEL
    this.plot.append("g").call(d3.axisLeft(this.yScale)).attr("id", "y-axis");
    this.plot
      .append("text")
      .attr("id", "y-label")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${-40}, ${this.innerHeight / 2}) rotate(270)`)
      .text(this.axes.y);

    // draw circles, DATA POINT
    this.plot
      .selectAll("circle")
      .data(this.data)
      .join("circle")
      .attr("cx", (d) => this.xScale(this.xValue(d)))
      .attr("cy", (d) => this.yScale(this.yValue(d)))
      .attr("fill", (d) => cScale(d["class"]))
      .attr("opacity", 0.6)
      .attr("r", 5);
  }
  update(axes) {
    this.axes = axes;
    this.xScale.domain(d3.extent(this.data.map(this.xValue))).nice();
    this.yScale.domain(d3.extent(this.data.map(this.yValue))).nice();
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
    width: 600,
    height: 600,
    margin: { left: 50, right: 50, top: 50, bottom: 50 },
    palette: ["#003f5c", "#bc5090", "#ffa600"],
  };
  const xAttrSelect = d3.select("#xAttrSelect");
  const yAttrSelect = d3.select("#yAttrSelect");
  const axes = {
    x: xAttrSelect.node().value,
    y: yAttrSelect.node().value,
  };
  const chart = new ScatterChart(dataset, layout, axes);
  xAttrSelect.on("change", (event) => {
    axes.x = event.target.value;
    chart.update(axes);
  });
  yAttrSelect.on("change", (event) => {
    axes.y = event.target.value;
    chart.update(axes);
  });
}

main();
