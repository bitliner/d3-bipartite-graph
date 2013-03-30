var width = 960,
	height = 500;

var color = d3.scale.category20();

// create force layout
var force = d3.layout.force().charge(-120).linkDistance(30).size([width, height]).distance(200);
var svg = d3.select("body").append("svg").attr("width", width).attr("height", height).append('svg:g').call(d3.behavior.zoom().on("zoom", redraw));

function redraw() {
	svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
	node.attr("transform", function(d) {
		return "translate(" + d.x + "," + d.y + ")";
	});
}

d3.json("my_graph_data.json", function(error, graph) {

	console.log("graph.nodes", graph.nodes)
	console.log("graph.links", graph.links)

	// start force layout
	force.nodes(graph.nodes).links(graph.links).start();

	var link = svg.selectAll(".link").data(graph.links).enter().append("line").attr("class", "link")
	.style("stroke-width", function(d) {
		return Math.sqrt(d.value);
	});

	var node=svg.selectAll('g.node').data(graph.nodes).enter().append('svg:g').attr('class','node').call(force.drag)
	var circles=node.append('circle').attr("r", 5).style("fill", function(d) {
		return color(d.group);
	});
	var texts=node.append('svg:text')
	.attr("dx", 12)
      .attr("dy", ".35em")
	.text(function(d){return d.name});
	node.append("title").text(function(d) {
		return d.name;
	});


	force.on("tick", function() {
		link.attr("x1", function(d) {
			return d.source.x;
		}).attr("y1", function(d) {
			return d.source.y;
		}).attr("x2", function(d) {
			return d.target.x;
		}).attr("y2", function(d) {
			return d.target.y;
		});

/*		circles.attr("cx", function(d) {
			return d.x;
		}).attr("cy", function(d) {
			return d.y;
		});
		texts.attr("cx", function(d) {
			return d.x;
		}).attr("cy", function(d) {
			return d.y;
		});
*/
		node.attr("transform", function(d) {
			var x=d.x,
				y=d.y; 
			if (x>300 && d.group=='tuple'){
				x=300
				d.x=x
			}
			if (x<500 && d.group=='pattern'){
				x=500
				d.x=x
			}
			
			return "translate(" + x + "," + y + ")"; 
		});


	});
});