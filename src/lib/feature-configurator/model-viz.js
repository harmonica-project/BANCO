export default function ModelViz(model) {
    if (!(this instanceof ModelViz))
        return new ModelViz(model);

    this.model = model;

    this.toDot = function() {
        function quote(str) {
            return "\"" + str.replace(/"/g, '\\"') + '"';
        }
    
        function nodeColor(feature) {
            if (feature.activated)
                return "#75bd75"; 
            if (feature.deactivated)
                return "#ffa19c"; 
            if (feature.checked)
                return "#e6ffe7"; 
            if (feature.unchecked)
                return "#ff3d33"; 
            return "grey";
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
        
        var dot = `
            digraph {\n
                subgraph clusterMain {
                    peripheries=0
                    graph [labelloc="b" labeljust="r" label=<
                        <table BORDER="0" CELLBORDER="1" CELLSPACING="0">
                            <tr>
                                <td>Checked</td>
                                <td bgcolor="#75bd75"></td>
                            </tr>
                            <tr>
                                <td>Checked (auto)</td>
                                <td width ='30px' bgcolor="#e6ffe7"></td>
                            </tr>
                            <tr>
                                <td>Unchecked</td>
                                <td bgcolor="#ff3d33"></td>
                            </tr>
                            <tr>
                                <td>Unchecked (auto)</td>
                                <td bgcolor="#ffa19c"></td>
                            </tr>
                            <tr>
                                <td>Indetermined</td>
                                <td bgcolor="grey"></td>
                            </tr>
                        </table>>
                    ];
            `;
        dot += 'node [style="filled" fontname="Arial Unicode MS, Arial"];\n';
        this.model.features.forEach(function(feature) {
            dot += node(feature);
            if (feature.parent)
                dot += edge(feature);
        });
        dot += "}}";
        
        return dot;
    };
}