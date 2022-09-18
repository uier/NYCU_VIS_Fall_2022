const DATA_PATH = "./iris.csv";

function render(data, xAttr, yAttr) {
  if (!data) return;
  const width = 1000;
  const height = 600;
  const margin = { left: 100, right: 20, top: 50, bottom: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const palette = ["#003f5c", "#bc5090", "#ffa600"];

  const plot = d3.select("svg").attr("width", width).attr("height", height);

  const xValue = (d) => d[xAttr];
  const yValue = (d) => d[yAttr];
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data.map(xValue)))
    .range([0, innerWidth]);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data.map(yValue)))
    .range([0, innerHeight]);
  const cScale = d3
    .scaleOrdinal()
    .domain(data.map((d) => d["class"]))
    .range(palette);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const innerPlot = plot.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

  // draw TITLE
  innerPlot
    .append("text")
    .attr("x", innerWidth / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .text("Iris distribution");

  // draw X AXIS & LABEL
  innerPlot.append("g").call(xAxis).attr("transform", `translate(0, ${innerHeight})`);
  innerPlot
    .append("text")
    .attr("x", innerWidth)
    .attr("y", innerHeight + 40)
    .attr("text-anchor", "end")
    .text(xAttr);

  // draw Y AXIS & LABEL
  innerPlot.append("g").call(yAxis);
  innerPlot.append("text").attr("x", 0).attr("y", -12).attr("text-anchor", "end").text(yAttr);

  // draw circles, DATA POINT
  innerPlot
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
  // const xAttrSelect = document.getElementById("xAttrSelect");
  // xAttrSelect.addEventListener("onchange", () => {});
  render(dataset, "sepal length", "sepal width");
}

main();
