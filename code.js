const theSpinningWheel = document.getElementById("chart");
const checkButton = document.getElementById("checkButton");

checkButton.addEventListener("click", function () {
  const invoiceInput = document.getElementById("invoice");
  const invoiceValue = invoiceInput.value;
  fetch(`http://127.0.0.1:8000/api/verify-invoice/${invoiceValue}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data.invoice_id);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  if (invoiceValue === "567") {
    let modal = document.getElementById("mdco");
    modal.remove();
    // theSpinningWheel.style.visibility = "visible";
    // alert("True");
  } else {
    // alert("False");
    invoiceInput.style.border = "2px solid red";
    // Make Border RED
  }
});

const invoiceInput = document.getElementById("invoice");
const numberButtons = document.querySelectorAll(".number-button");
const deleteButton = document.getElementById("deleteButton");

numberButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const number = this.textContent;
    invoiceInput.value += number;
  });
});
deleteButton.addEventListener("click", function () {
  invoiceInput.value = invoiceInput.value.slice(0, -1); // Remove last character
});

// BALLOON Container
const balloonContainer = document.getElementById("balloon-container");
function random(num) {
  return Math.floor(Math.random() * num);
}

function getRandomStyles() {
  var r = random(255);
  var g = random(255);
  var b = random(255);
  var mt = random(200);
  var ml = random(50);
  var dur = random(5) + 5;
  return `
    background-color: rgba(${r},${g},${b},0.7);
    color: rgba(${r},${g},${b},0.7); 
    box-shadow: inset -7px -3px 10px rgba(${r - 10},${g - 10},${b - 10},0.7);
    margin: ${mt}px 0 0 ${ml}px;
    animation: float ${dur}s ease-in infinite
    `;
}

function createBalloons(num) {
  for (var i = num; i > 0; i--) {
    var balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.style.cssText = getRandomStyles();
    balloonContainer.append(balloon);
  }
}

function removeBalloons() {
  balloonContainer.style.opacity = 0;
  setTimeout(() => {
    balloonContainer.remove();
  }, 500);
}
// BALLOON Container

var dataAPI;
window.addEventListener("load", function () {
  dataAPI = [
    {
      label: "Dell Laptop",
      value: 6,
    }, 
    {
      label: "IPhone",
      value: 8,
    },
    {
      label: "Mobile",
      value: 9,
    }, 
  ];
  var padding = { top: 20, right: 40, bottom: 0, left: 0 },
    w = 500 - padding.left - padding.right,
    h = 500 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20(); //category20c()
  var data = dataAPI;
  var svg = d3
    .select("#chart")
    .append("svg")
    .data([data])
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);
  var container = svg
    .append("g")
    .attr("class", "chartholder")
    .attr(
      "transform",
      "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
    );
  var vis = container.append("g");
  var pie = d3.layout
    .pie()
    .sort(null)
    .value(function (d) {
      return 1;
    });
  // declare an arc generator function
  var arc = d3.svg.arc().outerRadius(r);
  // select paths, use arc generator to draw
  var arcs = vis
    .selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

  arcs
    .append("path")
    .attr("fill", function (d, i) {
      return color(i);
    })
    .attr("d", function (d) {
      return arc(d);
    });
  arcs
    .append("text")
    .attr("transform", function (d) {
      d.innerRadius = 0;
      d.outerRadius = r;
      d.angle = (d.startAngle + d.endAngle) / 2;
      return (
        "rotate(" +
        ((d.angle * 180) / Math.PI - 90) +
        ")translate(" +
        (d.outerRadius - 10) +
        ")"
      );
    })
    .attr("text-anchor", "end")
    .text(function (d, i) {
      return data[i].label;
    });
  container.on("click", spin);

  function spin(d) {
    container.on("click", null);
    //all slices have been seen, all done
    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
    if (oldpick.length == data.length) {
      console.log("done");
      container.on("click", null);
      return;
    }
    var ps = 360 / data.length,
      pieslice = Math.round(1440 / data.length),
      rng = Math.floor(Math.random() * 1440 + 360);

    rotation = Math.round(rng / ps) * ps;

    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? picked % data.length : picked;
    if (oldpick.indexOf(picked) !== -1) {
      d3.select(this).call(spin);
      return;
    } else {
      oldpick.push(picked);
    }
    rotation += 90 - Math.round(ps / 2);
    vis
      .transition()
      .duration(3000)
      .attrTween("transform", rotTween)
      .each("end", function () {
        //mark question as seen
        d3.select(".slice:nth-child(" + (picked + 1) + ") path").attr(
          "fill",
          "#111"
        );
        //populate question
        d3.select("#question h1").text(data[picked].question);
        oldrotation = rotation;

        /* Get the result value from object "data" */
        console.log(data[picked].value);

        /* Comment the below line for restrict spin to sngle time */

        Swal.fire({
          title: "You Won : " + data[picked].label,
          confirmButtonText: "Save",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("Saved!", "", "success");
          }
        });

        theSpinningWheel.remove();
        createBalloons(30);
        // container.on("click", spin);
        // createBalloons(30) ;
        // alert("Finished");
      });
    // createBalloons(30) ;
  }
  //make arrow
  svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (w + padding.left + padding.right) +
        "," +
        (h / 2 + padding.top) +
        ")"
    )
    .append("path")
    .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
    .style({ fill: "black" });
  //draw spin circle
  container
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 60)
    .style({ fill: "white", cursor: "pointer" });
  //spin text
  container
    .append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({ "font-weight": "bold", "font-size": "30px" });

  function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function (t) {
      return "rotate(" + i(t) + ")";
    };
  }

  //   function getRandomNumbers() {
  //     var array = new Uint16Array(1000);
  //     var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
  //     if (
  //       window.hasOwnProperty("crypto") &&
  //       typeof window.crypto.getRandomValues === "function"
  //     ) {
  //       window.crypto.getRandomValues(array);
  //       console.log("works");
  //     } else {
  //       //no support for crypto, get crappy random numbers
  //       for (var i = 0; i < 1000; i++) {
  //         array[i] = Math.floor(Math.random() * 100000) + 1;
  //       }
  //     }
  //     return array;
  //   }
});
