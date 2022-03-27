export default function ModelViz(model) {
    if (!(this instanceof ModelViz))
        return new ModelViz(model);

    this.model = model;

    this.toDot = function() {
        const legend = `Legend [shape=none, margin=0, label=<
            <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
             <TR>
              <TD COLSPAN="2"><B>Legend</B></TD>
             </TR>
             <TR>
              <TD>Foo</TD>
              <TD><FONT COLOR="red">Foo</FONT></TD>
             </TR>
             <TR>
              <TD>Bar</TD>
              <TD BGCOLOR="RED"></TD>
             </TR>
             <TR>
              <TD>Baz</TD>
              <TD BGCOLOR="BLUE"></TD>
             </TR>
             <TR>
              <TD>Test</TD>
              <TD><IMG src="so.png" SCALE="False" /></TD>
             </TR>
             <TR>
              <TD>Test</TD>
              <TD CELLPADDING="4">
               <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="0" CELLPADDING="0">
                <TR>
                 <TD BGCOLOR="Yellow"></TD>
                </TR>
               </TABLE>
              </TD>
             </TR>
            </TABLE>
           >];
          }
        `;

        function quote(str) {
            return "\"" + str.replace(/"/g, '\\"') + '"';
        }
    
        function nodeColor(feature) {
            if (feature.activated)
                return "#C1E1C1"; 
            if (feature.deactivated)
                return "#ffa19c"; 
            if (feature.checked)
                return "#e6ffe7"; 
            if (feature.unchecked)
                return "#ff6961"; 
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
                                <td>Checked (auto)</td>
                                <td width ='30px' bgcolor="#C1E1C1"></td>
                            </tr>
                            <tr>
                                <td>Unchecked (auto)</td>
                                <td bgcolor="#ffa19c"></td>
                            </tr>
                            <tr>
                                <td>Checked</td>
                                <td bgcolor="#e6ffe7"></td>
                            </tr>
                            <tr>
                                <td>Unchecked</td>
                                <td bgcolor="#ff6961"></td>
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
        
        console.log(dot)
        return dot;
    };
}