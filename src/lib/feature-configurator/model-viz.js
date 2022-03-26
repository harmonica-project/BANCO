export default function ModelViz(model) {
    if (!(this instanceof ModelViz))
        return new ModelViz(model);

    this.model = model;

    this.toDot = function(configuration) {
        function quote(str) {
            return "\"" + str.replace(/"/g, '\\"') + '"';
        }
    
        function nodeColor(feature) {
            if (feature.activated)
                return feature.abstract ? "#C1E1C1" : "#b3e6b4"; // base #ccffcd
            if (feature.deactivated)
                return feature.abstract ? "#ff6961" : "#b3e6b4"; // base #ccffcd
            if (feature.checked)
                return feature.abstract ? "#e6ffe7" : "#b3e6b4"; // base #ccffcd
            if (feature.unchecked)
                return feature.abstract ? "#ffe6e6" : "#e6b3b3"; // base #ffcccc
            return feature.abstract ? "#f2f2ff" : "#ccccff";
        }
    
        function node(feature) {
            return quote(feature.name) + ' [fillcolor="' + nodeColor(feature) + '"' +
                (feature.description ? ' tooltip=' + quote(feature.description) : '') +
                ' shape=' + (feature.alternative || feature.or ? "invhouse" : "box") +
                '];\n';
        }
    
        function edge(feature) {
            var arrowHead =
                feature.parent.alternative ? "none" :
                feature.parent.or ? "none" :
                feature.mandatory ? "dot" : "odot";
            var arrowTail =
                feature.parent.alternative ? "odot" :
                feature.parent.or ? "dot" : "none";
            return quote(feature.parent.name) + " -> " + quote(feature.name) +
                ' [arrowhead=' + arrowHead + ', arrowtail=' + arrowTail + ', dir=both];\n';
        }
        
        var dot = "digraph {\n";
        dot += 'node [style=filled fontname="Arial Unicode MS, Arial"];\n';
        this.model.features.forEach(function(feature) {
            dot += node(feature);
            if (feature.parent)
                dot += edge(feature);
        });
        dot += "}";
        
        return dot;
    };
}