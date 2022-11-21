<script setup>
import { renderQueue } from "../lib/renderQueue";
import * as d3 from "d3";
import { ref, onMounted, defineProps } from "vue";

const props = defineProps(["data", "selectedGenres"]);

const output = ref("");

onMounted(async () => {
  // const margin = { top: 36, right: 36, bottom: 360, left: 120 };
  const margin = { top: 36, right: 36, bottom: 12, left: 120 };

  const devicePixelRatio = window.devicePixelRatio || 1;

  const rootElement = "#par-coord";
  const container = d3.select(rootElement);

  const width = container.node().clientWidth - margin.left - margin.right;
  const height = container.node().clientHeight - margin.top - margin.bottom;
  const innerHeight = height - 2;

  const canvas = container
    .append("canvas")
    .attr("width", width * devicePixelRatio)
    .attr("height", height * devicePixelRatio)
    .style("width", width + "px")
    .style("height", height + "px")
    .style("margin-top", margin.top + "px")
    .style("margin-left", margin.left + "px");

  const svg = container
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const ctx = canvas.node().getContext("2d");
  ctx.globalCompositeOperation = "darken";
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1.5;
  ctx.scale(devicePixelRatio, devicePixelRatio);

  const color = d3
    .scaleOrdinal()
    .range([
      "#5DA5B3",
      "#D58323",
      "#DD6CA7",
      "#54AF52",
      "#8C92E8",
      "#E15E5A",
      "#aa73de",
      "#b0933c",
      "#50AB84",
      "#954D56",
    ]);

  const tickLabel = {
    key: {
      0: "C",
      1: "C♯/D♭",
      2: "D",
      3: "E♭",
      4: "E",
      5: "F",
      6: "F♯/G♭",
      7: "G",
      8: "A♭",
      9: "A",
      10: "B♭",
      11: "B/C♭",
    },
    mode: {
      0: "Minor",
      1: "Major",
    },
  };

  const types = {
    Number: {
      key: "Number",
      coerce: (d) => +d,
      extent: d3.extent,
      within: (d, extent, dim) => extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1],
      defaultScale: d3.scaleLinear().range([innerHeight, 0]),
    },
    String: {
      key: "String",
      coerce: String,
      extent: (d) => d.sort(),
      within: (d, extent, dim) => extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1],
      defaultScale: d3.scalePoint().range([0, innerHeight]),
    },
  };

  const dimensions = [
    {
      key: "track_genre",
      description: "Genre",
      type: types["String"],
      axis: d3.axisLeft().tickFormat((d) => d),
    },
    {
      key: "popularity",
      description: "Popularity",
      type: types["Number"],
      scale: d3.scaleLinear().range([innerHeight, 0]),
    },
    {
      key: "duration_ms",
      description: "Duration (ms)",
      type: types["Number"],
      scale: d3.scaleLinear().range([innerHeight, 0]),
    },
    {
      key: "danceability",
      description: "Danceability",
      type: types["Number"],
      scale: d3.scaleLinear().range([innerHeight, 0]),
    },
    {
      key: "energy",
      description: "Energy",
      type: types["Number"],
      scale: d3.scaleLinear().range([innerHeight, 0]),
    },
    {
      key: "loudness",
      description: "Loudness",
      type: types["Number"],
      scale: d3.scaleLinear().range([innerHeight, 0]),
    },
    {
      key: "speechiness",
      description: "Speechiness",
      type: types["Number"],
      scale: d3.scaleLinear().range([innerHeight, 0]),
    },
    {
      key: "acousticness",
      description: "Acousticness",
      type: types["Number"],
      scale: d3.scaleLinear().range([innerHeight, 0]),
    },
    {
      key: "instrumentalness",
      description: "Instrumentalness",
      type: types["Number"],
      scale: d3.scaleLinear().range([innerHeight, 0]),
    },
    {
      key: "liveness",
      description: "Liveness",
      type: types["Number"],
      scale: d3.scaleLinear().range([innerHeight, 0]),
    },
    {
      key: "valence",
      description: "Valence",
      type: types["Number"],
      scale: d3.scaleLinear().range([innerHeight, 0]),
    },
    {
      key: "tempo",
      description: "Tempo",
      type: types["Number"],
      scale: d3.scaleLinear().range([innerHeight, 0]),
    },
    {
      key: "key",
      description: "Key",
      type: types["Number"],
      scale: d3.scaleLinear().range([innerHeight, 0]),
      axis: d3.axisLeft().tickFormat((d) => tickLabel.key[d]),
    },
    {
      key: "time_signature",
      description: "Time Signature",
      type: types["Number"],
      scale: d3.scaleLinear().range([innerHeight, 0]),
      axis: d3.axisLeft().tickFormat((d) => `${d}/4`),
    },
    {
      key: "mode",
      description: "Mode",
      type: types["Number"],
      scale: d3.scalePoint().range([innerHeight, 0]),
      axis: d3.axisRight().tickFormat((d) => tickLabel.mode[d]),
    },
  ];

  const xscale = d3.scalePoint().domain(d3.range(dimensions.length)).range([0, width]);

  const yAxis = d3.axisLeft();

  const axes = svg
    .selectAll(".axis")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", (d) => `axis ${d.key.replace(/ /g, "_")}`)
    .attr("transform", (_, i) => `translate(${xscale(i)})`);

  let data = props.data;
  data = data.filter((d) => props.selectedGenres.includes(d.track_genre));

  // shuffle the data!
  data = d3.shuffle(data);

  data.forEach(function (d) {
    dimensions.forEach(function (p) {
      d[p.key] = !d[p.key] ? null : p.type.coerce(d[p.key]);
    });

    // truncate long text strings to fit in data table
    for (const key in d) {
      if (d[key] && d[key].length > 35) d[key] = d[key].slice(0, 36);
    }
  });

  // type/dimension default setting happens here
  dimensions.forEach(function (dim) {
    if (!("domain" in dim)) {
      // detect domain using dimension type's extent function
      dim.domain = d3_functor(dim.type.extent)(
        data.map(function (d) {
          return d[dim.key];
        })
      );
    }
    if (!("scale" in dim)) {
      // use type's default scale for dimension
      dim.scale = dim.type.defaultScale.copy();
    }
    dim.scale.domain(dim.domain);
  });

  const render = renderQueue(draw).rate(100);

  ctx.clearRect(0, 0, width, height);
  ctx.globalAlpha = d3.min([0.85 / Math.pow(data.length, 0.3), 1]);
  render(data);
  // render(data.filter((d) => props.selectedGenres.includes(d.track_genre)));

  axes
    .append("g")
    .each(function (d) {
      const renderAxis =
        "axis" in d
          ? d.axis.scale(d.scale) // custom axis
          : yAxis.scale(d.scale); // default axis
      d3.select(this).call(renderAxis);
    })
    .append("text")
    .attr("class", "title")
    .attr("text-anchor", "start")
    .text((d) => ("description" in d ? d.description : d.key));

  // Add and store a brush for each axis.
  axes
    .append("g")
    .attr("class", "brush")
    .each(function (d) {
      d3.select(this).call(
        (d.brush = d3
          .brushY()
          .extent([
            [-10, 0],
            [10, height],
          ])
          .on("start", brushstart)
          .on("brush", brush)
          .on("end", brush))
      );
    })
    .selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);

  d3.selectAll(".axis.track_genre .tick text").style("fill", color);

  // output.text(d3.tsvFormat(data.slice(0, 24)));
  output.value = d3.tsvFormat(data.slice(0, 24));

  function project(d) {
    return dimensions.map(function (p, i) {
      // check if data element has property and contains a value
      if (!(p.key in d) || d[p.key] === null) return null;

      return [xscale(i), p.scale(d[p.key])];
    });
  }

  function draw(d) {
    ctx.strokeStyle = color(d.track_genre);
    ctx.beginPath();
    const coords = project(d);
    coords.forEach(function (p, i) {
      // this tricky bit avoids rendering null values as 0
      if (p === null) {
        // this bit renders horizontal lines on the previous/next
        // dimensions, so that sandwiched null values are visible
        if (i > 0) {
          const prev = coords[i - 1];
          if (prev !== null) {
            ctx.moveTo(prev[0], prev[1]);
            ctx.lineTo(prev[0] + 6, prev[1]);
          }
        }
        if (i < coords.length - 1) {
          const next = coords[i + 1];
          if (next !== null) {
            ctx.moveTo(next[0] - 6, next[1]);
          }
        }
        return;
      }

      if (i == 0) {
        ctx.moveTo(p[0], p[1]);
        return;
      }

      ctx.lineTo(p[0], p[1]);
    });
    ctx.stroke();
  }

  function brushstart() {
    d3.event.sourceEvent.stopPropagation();
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    render.invalidate();

    const actives = [];
    svg
      .selectAll(".axis .brush")
      .filter(function (d) {
        return d3.brushSelection(this);
      })
      .each(function (d) {
        actives.push({
          dimension: d,
          extent: d3.brushSelection(this),
        });
      });

    const selected = data.filter(function (d) {
      if (
        actives.every(function (active) {
          const dim = active.dimension;
          // test if point is within extents for each active brush
          return dim.type.within(d[dim.key], active.extent, dim);
        })
      ) {
        return true;
      }
    });

    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = d3.min([0.85 / Math.pow(selected.length, 0.3), 1]);
    render(selected);

    // output.text(d3.tsvFormat(selected.slice(0, 24)));
    output.value = d3.tsvFormat(selected.slice(0, 24));
  }
  // });

  function d3_functor(v) {
    return typeof v === "function" ? v : () => v;
  }
});
</script>

<template>
  <div id="par-coord" class="w-full h-full" />
</template>

<style scoped>
#par-coord {
  min-width: 760px;
}

#par-coord >>> {
  display: block;
}

#par-coord >>> svg,
#par-coord >>> canvas {
  font: 10px sans-serif;
  position: absolute;
}

#par-coord >>> canvas {
  opacity: 0.9;
  pointer-events: none;
}

#par-coord >>> .axis .title {
  font-size: 10px;
  transform: rotate(-21deg) translate(-5px, -6px);
  fill: #fbbd23;
}

#par-coord >>> .axis line,
#par-coord >>> .axis path {
  fill: none;
  stroke: #666;
  stroke-width: 1px;
}

#par-coord >>> .axis .tick text {
  fill: #d7cccc;
  opacity: 0.2;
  pointer-events: none;
}

#par-coord >>> .axis.manufac_name .tick text,
#par-coord >>> .axis.food_group .tick text {
  opacity: 1;
}

#par-coord >>> .axis:hover line,
#par-coord >>> .axis:hover path,
#par-coord >>> .axis.active line,
#par-coord >>> .axis.active path {
  fill: none;
  stroke: #d7cccc;
  stroke-width: 1px;
}

#par-coord >>> .axis:hover .title {
  font-weight: bold;
}

#par-coord >>> .axis:hover .tick text {
  opacity: 1;
}

#par-coord >>> .axis.active .title {
  font-weight: bold;
}

#par-coord >>> .axis.active .tick text {
  opacity: 1;
  font-weight: bold;
}

#par-coord >>> .axis.track_genre .tick text {
  opacity: 1;
  font-size: 12px;
  font-weight: bold;
}

#par-coord >>> .brush .extent {
  fill-opacity: 0.3;
  stroke: #d7cccc;
  stroke-width: 1px;
}
</style>
