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
    // .domain([0, d3.max(data.map(xValue))])
    .domain(d3.extent(data.map(xValue)))
    .nice()
    .range([0, innerWidth]);
  const yScale = d3
    .scaleLinear()
    // .domain([d3.max(data.map(yValue)), 0])
    .domain(d3.extent(data.map(yValue)))
    .nice()
    .range([innerHeight, 0]);
  const cScale = d3
    .scaleOrdinal()
    .domain(data.map((d) => d["class"]))
    .range(palette);

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
  plot
    .append("g")
    .call(d3.axisBottom(xScale))
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`);
  plot
    .append("text")
    .attr("id", "x-label")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${innerWidth / 2}, ${innerHeight + 40})`)
    .text(xAttr);

  // draw Y AXIS & LABEL
  plot.append("g").call(d3.axisLeft(yScale)).attr("id", "y-axis");
  plot
    .append("text")
    .attr("id", "y-label")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${-40}, ${innerHeight / 2}) rotate(270)`)
    .text(yAttr);

  // draw circles, DATA POINT
  plot
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => xScale(xValue(d)))
    .attr("cy", (d) => yScale(yValue(d)))
    .attr("fill", (d) => cScale(d["class"]))
    .attr("opacity", 0.6)
    .attr("r", 5);

  return {
    update({ xAttr, yAttr }) {
      const xValue = (d) => d[xAttr];
      const yValue = (d) => d[yAttr];
      xScale.domain(d3.extent(data.map(xValue))).nice();
      yScale.domain(d3.extent(data.map(yValue))).nice();
      plot.select("#x-axis").transition().duration(1000).call(d3.axisBottom(xScale));
      plot.select("#y-axis").transition().duration(1000).call(d3.axisLeft(yScale));
      plot.select("#x-label").text(xAttr);
      plot.select("#y-label").text(yAttr);
      plot
        .selectAll("circle")
        .data(data)
        .join("circle", (update) =>
          update
            .transition()
            .duration(1000)
            .attr("cx", (d) => xScale(xValue(d)))
            .attr("cy", (d) => yScale(yValue(d)))
        );
    },
  };
}

async function main() {
  const dataset = await d3.csv(DATA_PATH);
  const xAttrSelect = d3.select("#xAttrSelect");
  const yAttrSelect = d3.select("#yAttrSelect");
  const axisAttrs = {
    xAttr: xAttrSelect.node().value,
    yAttr: yAttrSelect.node().value,
  };
  // TODO: refactor with class
  const chart = render(dataset, axisAttrs);
  xAttrSelect.on("change", (event) => {
    axisAttrs.xAttr = event.target.value;
    chart.update(axisAttrs);
    // render(dataset, axisAttrs);
  });
  yAttrSelect.on("change", (event) => {
    axisAttrs.yAttr = event.target.value;
    chart.update(axisAttrs);
    // render(dataset, axisAttrs);
  });
}

main();
