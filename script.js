var screenWidth = 1280
var screenHeight = 594 + 120;

var fillColor = "#f0ffe1"
var background = "#2f2f2fff"

var svg = d3.select('svg')
svg.attr("width", screenWidth)
svg.attr("height", screenHeight)

var i = 0;

function createCircle(cx, cy, r, val){
    var clonedNode = d3.select("#nodeTemplate").node().cloneNode(true);
    var selection = d3.select(clonedNode)
    var nodeId = 'node-' + val

    selection.attr("id", nodeId);
    selection.selectAll('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', r)
      .attr('fill', fillColor)
      .attr('opacity', 0.8);

    selection.select("#blankCircle").attr("r", 1.25*r).attr("fill", background).attr('opacity', 1);
    selection.select("#outerCircle").attr("r", 1.25*r + 1)

    selection.select("text")
      .attr("x", cx)
      .attr("y", cy)
      .attr("text-anchor", 'middle')
      .attr("dominant-baseline", 'central')
      .attr("font-size", 45)
      .attr("fill", background)
      .text(val)

    svg.append(()=>clonedNode);
    // i+=1
    return "#" + nodeId
}

function translateRelative(selector, time, x, y){
  selection = d3.selectAll(selector)
  selection.transition()
          .duration(time)
          .attr("transform", "translate(" + x + "," + y + ")");
}

function changeOpacity(selector, time, op){
  selection = d3.selectAll(selector)
  selection.transition()
          .duration(time)
          .attr("opacity", op);
}

function translateRelativeWithOpacity(selector, time, x, y, op){
  selection = d3.selectAll(selector)
  selection.transition()
          .duration(time)
          .attr("transform", "translate(" + x + "," + y + ")")
          .attr("opacity", op);
}

function createDashedCircle(cx, cy, r){
  var clonedNode = d3.select("#dashedNodeTemplate").node().cloneNode(true);
  var selection = d3.select(clonedNode)
  var nodeId = 'dashedNode-' + i

  selection.attr("id", nodeId);
  selection.selectAll('circle')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', r)
    .attr('opacity', 0.25)
    .attr("stroke", fillColor)

    const circle = selection.select('circle');
    console.log(circle)
    const circumference = 2 * Math.PI * r;  // 2 * π * r

    function rotateStroke() {
        circle.transition()
            .duration(5000)
            .ease(d3.easeLinear) // continuous linear movement
            .attr("stroke-dashoffset", circumference)
            .end()  // Returns a promise for D3 v6
            .then(() => {
                circle.attr("stroke-dashoffset", 0);  // Reset without transition
                rotateStroke();  // Call the function again
            });
    }
    rotateStroke()

  svg.append(()=>clonedNode);
  i+=1
  return "#" + nodeId
}

function translateNodesWithOpacity(nodes, time, x, y, op){
  for(var node of nodes){
    var selection = d3.select(node)

    selection.transition()
            .duration(time)
            .attr("transform", "translate(" + x + "," + y + ")")

    selection.select("#innerCircle")
              .transition()
              .duration(time)
              .attr("opacity", op)

    selection.select("#outerCircle")
              .transition()
              .duration(time)
              .attr("opacity", op)
  }
}

function activeNode(id){
  var selection = d3.select(id)

  selection.select("#innerCircle")
          .attr("opacity", 0.8)

  selection.select("#outerCircle")
    .attr("opacity", 0.8)
    .transition()
    .duration(400)
    .attr("r", 60)

    selection.select("#blankCircle")
      // .attr("opacity", 0.8)
      .transition()
      .duration(400)
      .attr("r", 50)

}

function InactiveNode(id){
  var selection = d3.select(id)

  // selection.select("#innerCircle")
  //           .attr("opacity", 0.4)

  selection.select("#outerCircle")
    // .attr("opacity", 0.4)
    .transition()
    .duration(400)
    .attr("r", 51)

    selection.select("#blankCircle")
      .transition()
      .duration(400)
      .attr("r", 50)
}

function addText(text, x, y, fontSize, op){
  var id = "text-" + i
  svg.append("text")
  .attr("id", id)
  .attr("opacity", 0)
  .attr("x", x)
  .attr("y", y + 10)
  .attr("text-anchor", 'middle')
  .attr("dominant-baseline", 'central')
  .attr("font-size", fontSize)
  .attr("fill", fillColor)
  .text(text)
  .transition()
  .duration(1000)
  .attr("y", y)
  .attr("opacity", op)

  i+= 1
  return "#" + id
}

async function removeText(id){
  var selection = d3.select(id)
  var y = selection.attr("y")

  selection.transition()
  .duration(1000)
  .attr("y", y - 10)
  .attr("opacity", 0)

  await delay(1000)
  selection.remove()

}

async function intro(){
  var c1c = {x: 320, y: 400};
  var c2c = {x: 480, y: 400};
  var c3c = {x: 640, y: 400};
  var c4c = {x: 800, y: 400};
  var c5c = {x: 960, y: 400};

  c1 = createCircle(c2c.x, c2c.y, 40, 1);
  c2 = createCircle(c1c.x, c1c.y, 40, 2);
  c3 = createCircle(c4c.x, c4c.y, 40, 3);
  c4 = createCircle(c3c.x, c3c.y, 40, 4);
  c5 = createCircle(c5c.x, c5c.y, 40, 5);

  translateRelativeWithOpacity(".node", 1000, 0, -43, 1)

  var nodes = [c1, c2, c3, c4, c5];

  await delay(3000);

  cd1 = createDashedCircle(c2c.x, c2c.y + 200, 30);
  cd2 = createDashedCircle(c1c.x, c1c.y + 200, 30);
  cd3 = createDashedCircle(c4c.x, c4c.y + 200, 30);
  cd4 = createDashedCircle(c3c.x, c3c.y + 200, 30);
  cd5 = createDashedCircle(c5c.x, c5c.y + 200, 30);

  translateRelativeWithOpacity(".dashedNode", 1000, 0, -100, 1)
  // translateRelativeWithOpacity(".node", 1000, 0, -150, 0.25)
  translateNodesWithOpacity(nodes, 1000, 0, -150, 0.25)

  await delay(1500);
  activeNode(c1)
  await delay(500);
  translateRelative(c1, 1500, -160, 100)
  await delay(1500)
  InactiveNode(c1)

  await delay(1000);
  activeNode(c2)
  await delay(500);
  // changeOpacity(c1, 250, 1)
  translateRelative(c2, 1500, 160, 100)
  await delay(1500)
  InactiveNode(c2)

  await delay(1000);
  activeNode(c3)
  await delay(500);
  // changeOpacity(c1, 250, 1)
  translateRelative(c3, 1500, -160, 100)
  await delay(1500)
  InactiveNode(c3)

  await delay(500);
  activeNode(c4)
    await delay(500);
  // changeOpacity(c1, 250, 1)
  translateRelative(c4, 1500, 160, 100)
  await delay(1500)
  InactiveNode(c4)

  await delay(1000);
  activeNode(c5)
    await delay(500);
  // changeOpacity(c1, 250, 1)
  translateRelative(c5, 1500, 0, 100)
  await delay(1500)
  InactiveNode(c5)

  await delay(1500)

  var t1 = addText("select #i min value", 640, 200, 65, 0.8)
  await delay(1500)
  var t2 = addText("place at #i position", 640, 280, 45, 0.5)
  await delay(1500)

  removeText(t1)
  removeText(t2)

  await delay(1000)

  translateRelative(c1, 1500, -160, -43)
  translateRelative(c2, 1500, 160, -43)
  translateRelative(c3, 1500, -160, -43)
  translateRelative(c4, 1500, 160, -43)
  translateRelative(c5, 1500, 0, -43)

  await delay(1500)

  // translateRelativeWithOpacity(".dashedNode", 1000, 0, -200, 1)
  activeNode(c1);
  addText("#1 Min", 320, 500, 25, 0.8)
  await delay(1000)

  activeNode(c2);
  addText("#2 Min", 480, 500, 25, 0.8)
  await delay(1000)

  activeNode(c3);
  addText("#3 Min", 640, 500, 25, 0.8)
  await delay(1000)

  activeNode(c4);
  addText("#4 Min", 800, 500, 25, 0.8)
  await delay(1000)

  activeNode(c5);
  addText("#5 Min", 960, 500, 25, 0.8)
  await delay(1000)



}
state = 1
d3.select("body").on("keydown", function() {
    // console.log(window.event)
    if(window.event.key === 'Enter') { // 13 is the key code for Enter
        main()
    }
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function main(){
  if(state == 1){
    intro()
  }
  state += 1
}
