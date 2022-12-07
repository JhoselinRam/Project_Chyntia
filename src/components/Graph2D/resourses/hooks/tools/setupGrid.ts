import { select } from "d3";
import { GridProps, GridType, MainGridProps, Scale } from "../../Graph2D_types/types";


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
            .each((d,i,node)=>{
                const tick = node[i] as SVGGElement;
                const label = (select(tick)
                                .select("text")
                                .node() as SVGTextElement)
                                .textContent as string;
                console.log(parseFloat(label.replaceAll(" ","")));
                // const xPosition = scale.x(label);

                // select(svg.current)
                //     .select("g.Graph2D_Grid_Main")
                //     .append("line")
                //     .attr("stroke", "curentColor")
                //     .attr("x1", xPosition)
                //     .attr("x2", xPosition)
                //     .attr("y1", 0)
                //     .attr("y2", height);
            });
        
        




        
    }

//-------------------------- Aux Grid ------------------------------
//------------------------------------------------------------------

    function setAuxGrid(){
        
    }
//------------------------------------------------------------------

    return {
        setMainGrid,
        setAuxGrid
    }
}

export default setupGrid;