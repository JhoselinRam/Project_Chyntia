import { select } from "d3";
import { BackgroundProps, BackgroundType } from "../../Graph2D_types/types";


function setupBackground({svg, backgroundColor} : BackgroundProps) : BackgroundType{
    
    function setBackground(){
        if(svg.current == null) return;

        select(svg.current).style("background-color", backgroundColor);
    }

    function setAxisBackground(){
        if(svg.current == null) return;
        
        select(svg.current)
            .selectAll("g.tick")
            .each((d,i,node)=>{
                const tick = (node[i] as SVGGElement);
                const size = (select(tick)
                                .select("text")
                                .node() as SVGTextElement)
                                .getBBox();
                
                select(tick)
                    .select("g.Background")
                    .append("rect")
                    .attr("x", size.x-2)
                    .attr("y", size.y-2)
                    .attr("width", size.width+4)
                    .attr("height", size.height+4)
                    .attr("fill", backgroundColor);

                const auxData = [0,2,1];
                select(tick)
                    .selectChildren()
                    .data(auxData)
                    .sort();
            })
    }

    return {setBackground, setAxisBackground};

}

export default setupBackground;