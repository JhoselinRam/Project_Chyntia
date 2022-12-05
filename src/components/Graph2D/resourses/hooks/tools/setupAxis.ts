import { select, axisBottom, axisRight, axisLeft, axisTop } from "d3";
import { AxisProps, AxisType, Scale, SetScaleType } from "../../Graph2D_types/types";

function setupAxis({svg, axisPosition, centerX, centerY, marginStart, marginTop, marginEnd, marginBottom} : AxisProps) : AxisType{
    
    function setAxis({scale, reference}:SetScaleType){
        if(svg.current == null) return;

        let axisX : any;
        let axisY : any;

        if(axisPosition==="center" || axisPosition==="bottom-left" || axisPosition==="bottom-right")    axisX = axisBottom(scale.x);
        else    axisX = axisTop(scale.x);

        if(axisPosition==="center" || axisPosition==="bottom-left" || axisPosition==="top-left")    axisY = axisLeft(scale.y);
        else    axisY = axisRight(scale.y);
            
    
        axisX.tickSizeOuter(0);
        axisY.tickSizeOuter(0);
        
        select(svg.current)
            .select("g.Graph2D_Axis")
            .append("g")
            .classed("Graph2D_AxisX", true)
            .call(axisX);
        
        select(svg.current)
            .select("g.Graph2D_Axis")
            .append("g")
            .classed("Graph2D_AxisY", true)
            .call(axisY);
        
        switch(axisPosition){
            case "center":
            setAxisCenter(reference);
            break;
        
        case "bottom-left":
            setAxisBottomLeft();
            break;

        case "bottom-right":
            setAxisBottomRight();
            break;
                
        case "top-left":
            setAxisTopLeft();
            break;
                    
        case "top-right":
            setAxisTopRight();
            break;
        }
        
    }

//------------------------------------------------------------------
//------------------------- Center ---------------------------------

    function setAxisCenter(reference : Scale){
        if(svg.current == null) return;

        select(svg.current)
            .select("g.Graph2D_AxisX")
            .style("transform", `translate(0,${reference?.y(centerY)}px)`);
            
        select(svg.current)
            .select("g.Graph2D_AxisY")
            .style("transform", `translate(${reference?.x(centerX)}px, 0)`);

            
        select(svg.current)
            .select("g.Graph2D_AxisX")
            .selectAll(".tick")
            .select("line")
            .attr("y2","8")
            .style("transform", "translate(0,-4px)");
            
        select(svg.current)
            .select("g.Graph2D_AxisY")
            .selectAll(".tick")
            .select("line")
            .attr("x2","8")
            .style("transform", "translate(-4px, 0)");

        
        select(svg.current)
            .selectAll(".tick")
            .each((d,i,nodes)=>{
                const tick = (nodes[i] as SVGGElement);
                const text = tick.children[1] as SVGTextElement;
                const label = text.textContent as string;
                const tolerance = 1e-5;

                if((parseFloat(label)) < tolerance){
                    tick.parentElement?.removeChild(tick);
                }
            });

        select(svg.current)
            .select("g.Graph2D_AxisX")
            .append("line")
            .attr("stroke", "currentColor")
            .attr("x1", 0)
            .attr("x2", marginStart+2)
            .attr("y1", 0.5)
            .attr("y2", 0.5);

        select(svg.current)
            .select("g.Graph2D_AxisX")
            .append("line")
            .attr("stroke", "currentColor")
            .attr("x1", svg.current.clientWidth-marginEnd-2)
            .attr("x2", svg.current.clientWidth)
            .attr("y1", 0.5)
            .attr("y2", 0.5);
                
        select(svg.current)
            .select("g.Graph2D_AxisY")
            .append("line")
            .attr("stroke", "currentColor")
            .attr("x1", 0.5)
            .attr("x2", 0.5)
            .attr("y1", 0)
            .attr("y2", marginTop+2);

        select(svg.current)
            .select("g.Graph2D_AxisY")
            .append("line")
            .attr("stroke", "currentColor")
            .attr("x1", 0.5)
            .attr("x2", 0.5)
            .attr("y1", svg.current.clientHeight-marginBottom-2)
            .attr("y2", svg.current.clientHeight);
    }

//------------------------------------------------------------------
//---------------------- Bottom Left -------------------------------

    function setAxisBottomLeft(){
        if(svg.current == null) return;

        const offsetY = (select(svg.current)
            .select("g.Graph2D_AxisX")
            .node() as SVGGElement)
            .getBBox()
            .height;
        
        const offsetX = (select(svg.current)
            .select("g.Graph2D_AxisY")
            .node() as SVGGElement)
            .getBBox()
            .width;

        select(svg.current)
            .select("g.Graph2D_AxisX")
            .attr("transform", `translate(0,${svg.current.clientHeight-offsetY-marginEnd})`);
        
        select(svg.current)
            .select("g.Graph2D_AxisY")
            .attr("transform", `translate(${offsetX+marginStart},0)`);

        select(svg.current)
            .select("g.Graph2D_AxisX")
            .append("line")
            .attr("stroke", "currentColor")
            .attr("x1", svg.current.clientWidth-marginEnd-2)
            .attr("x2", svg.current.clientWidth)
            .attr("y1", 0.5)
            .attr("y2", 0.5);
                
        select(svg.current)
            .select("g.Graph2D_AxisY")
            .append("line")
            .attr("stroke", "currentColor")
            .attr("x1", 0.5)
            .attr("x2", 0.5)
            .attr("y1", 0)
            .attr("y2", marginTop+2);
    }

//------------------------------------------------------------------
//----------------------- Bottom Right -----------------------------

    function setAxisBottomRight(){
        if(svg.current == null) return;

        const offsetY = (select(svg.current)
            .select("g.Graph2D_AxisX")
            .node() as SVGGElement)
            .getBBox()
            .height;
        
        const offsetX = (select(svg.current)
            .select("g.Graph2D_AxisY")
            .node() as SVGGElement)
            .getBBox()
            .width;

        select(svg.current)
            .select("g.Graph2D_AxisX")
            .attr("transform", `translate(0,${svg.current.clientHeight-offsetY-marginEnd})`);
        
        select(svg.current)
            .select("g.Graph2D_AxisY")
            .attr("transform", `translate(${svg.current.clientWidth-offsetX-marginEnd},0)`);

        select(svg.current)
            .select("g.Graph2D_AxisX")
            .append("line")
            .attr("stroke", "currentColor")
            .attr("x1", 0)
            .attr("x2", marginStart+2)
            .attr("y1", 0.5)
            .attr("y2", 0.5);

        select(svg.current)
            .select("g.Graph2D_AxisY")
            .append("line")
            .attr("stroke", "currentColor")
            .attr("x1", 0.5)
            .attr("x2", 0.5)
            .attr("y1", 0)
            .attr("y2", marginTop+2);
        
    }

//------------------------------------------------------------------
//------------------------- Top Left -------------------------------

    function setAxisTopLeft(){
        if(svg.current == null) return;

        const offsetY = (select(svg.current)
            .select("g.Graph2D_AxisX")
            .node() as SVGGElement)
            .getBBox()
            .height;
        
        const offsetX = (select(svg.current)
            .select("g.Graph2D_AxisY")
            .node() as SVGGElement)
            .getBBox()
            .width;

        select(svg.current)
            .select("g.Graph2D_AxisX")
            .attr("transform", `translate(0,${offsetY + marginTop})`);
        
        select(svg.current)
            .select("g.Graph2D_AxisY")
            .attr("transform", `translate(${offsetX + marginStart},0)`);

        select(svg.current)
            .select("g.Graph2D_AxisX")
            .append("line")
            .attr("stroke", "currentColor")
            .attr("x1", svg.current.clientWidth-marginEnd-2)
            .attr("x2", svg.current.clientWidth)
            .attr("y1", 0.5)
            .attr("y2", 0.5);

        select(svg.current)
            .select("g.Graph2D_AxisY")
            .append("line")
            .attr("stroke", "currentColor")
            .attr("x1", 0.5)
            .attr("x2", 0.5)
            .attr("y1", svg.current.clientHeight-marginBottom-2)
            .attr("y2", svg.current.clientHeight);
    }

//------------------------------------------------------------------
//------------------------- Top Right ------------------------------

    function setAxisTopRight(){
        if(svg.current == null) return;

        const offsetY = (select(svg.current)
            .select("g.Graph2D_AxisX")
            .node() as SVGGElement)
            .getBBox()
            .height;
        
        const offsetX = (select(svg.current)
            .select("g.Graph2D_AxisY")
            .node() as SVGGElement)
            .getBBox()
            .width;

        select(svg.current)
            .select("g.Graph2D_AxisX")
            .attr("transform", `translate(0,${offsetY + marginTop})`);
        
        select(svg.current)
            .select("g.Graph2D_AxisY")
            .attr("transform", `translate(${svg.current.clientWidth-offsetX-marginEnd},0)`);

        select(svg.current)
            .select("g.Graph2D_AxisX")
            .append("line")
            .attr("stroke", "currentColor")
            .attr("x1", 0)
            .attr("x2", marginStart+2)
            .attr("y1", 0.5)
            .attr("y2", 0.5);

        select(svg.current)
            .select("g.Graph2D_AxisY")
            .append("line")
            .attr("stroke", "currentColor")
            .attr("x1", 0.5)
            .attr("x2", 0.5)
            .attr("y1", svg.current.clientHeight-marginBottom-2)
            .attr("y2", svg.current.clientHeight);
        
    }

//------------------------------------------------------------------
//------------------------------------------------------------------

    return {setAxis};
}

export default setupAxis;