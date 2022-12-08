import { select } from "d3";
import { AuxGridProps, GetBoxType, GridProps, GridType, MainGridProps } from "../../Graph2D_types/types";


function setupGrid({svg, axisPosition, marginStart, marginTop, marginEnd, marginBottom}:GridProps)  : GridType{

//-------------------------- Main Grid -----------------------------
//------------------------------------------------------------------
    function setMainGrid({scale} : MainGridProps){
        if(svg.current == null) return;
        
        const {minX, maxX, minY, maxY} = getCanvasBox();
        
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
                    .attr("y1", minY)
                    .attr("y2", maxY);
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
                    .attr("x1", minX)
                    .attr("x2", maxX)
                    .attr("y1", yPosition)
                    .attr("y2", yPosition);
            });
    }

//-------------------------- Aux Grid ------------------------------
//------------------------------------------------------------------

    function setAuxGrid({scale} : AuxGridProps){
        if(svg.current == null) return;
        
        const {minX, maxX, minY, maxY} = getCanvasBox();
        
        select(svg.current)
            .select("g.Graph2D_Grid")
            .append("g")
            .classed("Graph2D_Grid_Aux", true);

        
        const divisions = 5;
        const positionsX : Array<number> = [];
        select(svg.current)
            .select("g.Graph2D_AxisX")
            .selectAll("g.tick")
            .each((d,i,nodes)=>{
                const tick = nodes[i] as SVGGElement;
                const label = select(tick)
                    .select("text")
                    .text()
                    .replace("−","-");
                
                positionsX.push(parseFloat(label));
            });
        const dx = positionsX[1]-positionsX[0];
        positionsX.push(positionsX[positionsX.length-1]+dx);

        const positionsY : Array<number> = [];
        select(svg.current)
            .select("g.Graph2D_AxisY")
            .selectAll("g.tick")
            .each((d,i,nodes)=>{
                const tick = nodes[i] as SVGGElement;
                const label = select(tick)
                    .select("text")
                    .text()
                    .replace("−","-");
                
                positionsY.push(parseFloat(label));
            });
        const dy = positionsY[1]-positionsY[0];
        positionsY.push(positionsY[positionsY.length-1]+dy);
        
        positionsX.forEach(position=>{
            for(let i=1; i<divisions; i++){
                const xPosition = scale.x(position-dx/divisions*i);
                if(xPosition < minX) continue;
                if(xPosition > maxX) continue;

                select(svg.current)
                    .select("g.Graph2D_Grid_Aux")
                    .append("line")
                    .attr("stroke", "currentColor")
                    .attr("opacity", 0.2)
                    .attr("stroke-dasharray", 1)
                    .attr("x1", xPosition)
                    .attr("x2", xPosition)
                    .attr("y1", minY)
                    .attr("y2", maxY);
            }
        });
        
        positionsY.forEach(position=>{
            for(let i=1; i<divisions; i++){
                const yPosition = scale.y(position-dy/divisions*i);
                if(yPosition < minY) continue;
                if(yPosition > maxY) continue;

                select(svg.current)
                    .select("g.Graph2D_Grid_Aux")
                    .append("line")
                    .attr("stroke", "currentColor")
                    .attr("opacity", 0.2)
                    .attr("stroke-dasharray", 1)
                    .attr("x1", minX)
                    .attr("x2", maxX)
                    .attr("y1", yPosition)
                    .attr("y2", yPosition);
            }
        });
        
    }
//------------------------------------------------------------------
//------------------------- Canvas Box -----------------------------

    function getCanvasBox() : GetBoxType{
        if(svg.current == null) return {maxX:0,minX:0,maxY:0,minY:0};

        const width = svg.current.clientWidth;
        const height = svg.current.clientHeight;
        const offsetX = (select(svg.current)
                            .select("g.Graph2D_AxisY")
                            .node() as SVGGElement)
                            .getBBox()
                            .width;
        const offsetY = (select(svg.current)
                            .select("g.Graph2D_AxisX")
                            .node() as SVGGElement)
                            .getBBox()
                            .height;

        switch(axisPosition){
            case "center":
                return {
                    minX : 0,
                    maxX : width,
                    minY : 0,
                    maxY : height
                }
                
            case "bottom-left":
                return {
                    minX : marginStart + offsetX,
                    maxX : width,
                    minY : 0,
                    maxY : height - marginBottom - offsetY
                }

            case "bottom-right":
                return {
                    minX : 0,
                    maxX : width - marginEnd - offsetX,
                    minY : 0,
                    maxY : height - marginBottom - offsetY
                }

            case "top-left":
                return {
                    minX : marginStart + offsetX,
                    maxX : width,
                    minY : marginTop + offsetY,
                    maxY : height
                }

            case "top-right":
                return {
                    minX : 0,
                    maxX : width - marginEnd - offsetX,
                    minY : marginTop + offsetY,
                    maxY : height
                }
        }              
    }

//------------------------------------------------------------------

    return {
        setMainGrid,
        setAuxGrid
    }
}

export default setupGrid;