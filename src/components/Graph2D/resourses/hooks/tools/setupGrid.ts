import { select } from "d3";
import { AuxGridProps, GridProps, GridType, MainGridProps, Scale } from "../../Graph2D_types/types";


function setupGrid({svg}:GridProps)  : GridType{

//-------------------------- Main Grid -----------------------------
//------------------------------------------------------------------
    function setMainGrid({scale} : MainGridProps){
        if(svg.current == null) return;
        
        const width = svg.current.clientWidth
        const height = svg.current.clientHeight
        
        select(svg.current)
            .select("g.Graph2D_Grid")
            .append("g")
            .classed("Graph2D_Grid_Main", true);

        select(svg.current)
            .select("g.Graph2D_AxisX")
            .selectAll("g.tick")
            .each((d,i,nodes)=>{
                const tick = nodes[i] as SVGGElement;
                const label = select(tick)
                                .select("text")
                                .text()
                                .replace("−","-");
                
                const xPosition = scale.x(parseFloat(label));

                select(svg.current)
                    .select("g.Graph2D_Grid_Main")
                    .append("line")
                    .attr("stroke", "currentColor")
                    .attr("opacity", 0.3)
                    .attr("x1", xPosition)
                    .attr("x2", xPosition)
                    .attr("y1", 0)
                    .attr("y2", height);
            });

        select(svg.current)
            .select("g.Graph2D_AxisY")
            .selectAll("g.tick")
            .each((d,i,nodes)=>{
                const tick = nodes[i] as SVGGElement;
                const label = select(tick)
                                .select("text")
                                .text()
                                .replace("−","-");
                
                const yPosition = scale.y(parseFloat(label));

                select(svg.current)
                    .select("g.Graph2D_Grid_Main")
                    .append("line")
                    .attr("stroke", "currentColor")
                    .attr("opacity", 0.3)
                    .attr("x1", 0)
                    .attr("x2", width)
                    .attr("y1", yPosition)
                    .attr("y2", yPosition);
            });
    }

//-------------------------- Aux Grid ------------------------------
//------------------------------------------------------------------

    function setAuxGrid({scale} : AuxGridProps){
        
    }
//------------------------------------------------------------------

    return {
        setMainGrid,
        setAuxGrid
    }
}

export default setupGrid;