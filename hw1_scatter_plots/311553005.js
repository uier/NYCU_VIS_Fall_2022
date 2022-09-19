const DATA_PATH = "./iris.csv";

function render(data, { xAttr, yAttr }) {
  if (!data) return;
  const width = 600;
  const height = 600;
  const margin = { left: 50, right: 50, top: 50, bottom: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const palette = ["#003f5c", "#bc5090", "#ffa600"];

  const plotContainer = d3.select("svg").attr("width", width).attr("height", height);

  const xValue = (d) => d[xAttr];
  const yValue = (d) => d[yAttr];
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.map(xValue))])
    .nice()
    // .domain(d3.extent(data.map(xValue)))
    .range([0, innerWidth]);
  const yScale = d3
    .scaleLinear()
    .domain([d3.max(data.map(yValue)), 0])
    .nice()
    // .domain(d3.extent(data.map(yValue)))
    .range([0, innerHeight]);
  const cScale = d3
    .scaleOrdinal()
    .domain(data.map((d) => d["class"]))
    .range(palette);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  plotContainer
    .selectAll("g#plot")
    .data([null])
    .enter()
    .append("g")
    .attr("id", "plot")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  const plot = plotContainer.select("g#plot");

  // draw TITLE
  plot
    .selectAll("text#title")
    .data([null])
    .enter()
    .append("text")
    .attr("id", "title")
    .attr("x", innerWidth / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .text("Iris distribution");

  // draw X AXIS & LABEL
  plot.append("g").call(xAxis).attr("transform", `translate(0, ${innerHeight})`);
  plot
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${innerWidth / 2}, ${innerHeight + 40})`)
    .text(xAttr);

  // draw Y AXIS & LABEL
  plot.append("g").call(yAxis);
  plot
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${-40}, ${innerHeight / 2}) rotate(270)`)
    .text(yAttr);

  // draw circles, DATA POINT
  plot
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(xValue(d)))
    .attr("cy", (d) => yScale(yValue(d)))
    .attr("fill", (d) => cScale(d["class"]))
    .attr("r", 5);
}

async function main() {
  const dataset = await d3.csv(DATA_PATH);
  const axisAttrs = {
    xAttr: "sepal length",
    yAttr: "sepal width",
  };
  render(dataset, axisAttrs);
  d3.select("#xAttrSelect").on("change", (event) => {
    axisAttrs.xAttr = event.target.value;
    render(dataset, axisAttrs);
  });
  d3.select("#yAttrSelect").on("change", (event) => {
    axisAttrs.yAttr = event.target.value;
    render(dataset, axisAttrs);
  });
}

main();
