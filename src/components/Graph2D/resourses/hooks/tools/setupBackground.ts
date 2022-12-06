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
                const tickElement = node[i] as SVGGElement;
                const size = (select(tickElement)
                                .select("text")
                                .node() as SVGLineElement)
                                .getBBox();
                
                select(tickElement)
                    .append("rect")
                    .attr("x", size.x-1)
                    .attr("y", size.y-1)
                    .attr("width", size.width+2)
                    .attr("height", size.height+2)
                    .attr("fill", backgroundColor);
            });

        const auxData = [0,2,1];
        select(svg.current)
            .selectAll("g.tick")
            .selectChildren()
            .data(auxData)
            .sort((a,b)=>{
                return a-b
            })
    }

    return {setBackground, setAxisBackground};

}

export default setupBackground;