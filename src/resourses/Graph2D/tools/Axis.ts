import { Axis, NumberValue, axisBottom, axisLeft, axisRight, axisTop, scaleLinear, select } from "d3";
import { Axis_Type, Grapg2D_State } from "../Graph2D_Types/types";

function Axis(state : Grapg2D_State) : Axis_Type{
    let axisX : Axis<NumberValue>
    let axisY : Axis<NumberValue>

//---------------------------------------------------------

    function compute(){
        if(state.scale == null) return;

        const axisGroup = state.canvas.select(".Graph2D_Axis");
        axisGroup.select(".Graph2D_AxisX").remove() //Remove old axis
        axisGroup.select(".Graph2D_AxisY").remove()

        if(state.axis.position==="center" || state.axis.position==="bottom-left" || state.axis.position==="bottom-right")    axisX = axisBottom(state.scale.inner.x);
        else    axisX = axisTop(state.scale.inner.x);

        if(state.axis.position==="center" || state.axis.position==="bottom-left" || state.axis.position==="top-left")    axisY = axisLeft(state.scale.inner.y);
        else    axisY = axisRight(state.scale.inner.y);

        axisX.tickSizeOuter(0);
        axisY.tickSizeOuter(0);

        //Generate the new axis and save its size
        const axisHeight = (axisGroup
                            .append("g")
                            .classed("Graph2D_AxisX", true)
                            .call(axisX)
                            .node() as SVGGElement)
                            .getBBox()
                            .height;
            
        const axisWidth = (axisGroup
                            .append("g")
                            .classed("Graph2D_AxisY", true)
                            .call(axisY)
                            .node() as SVGGElement)
                            .getBBox()
                            .width;
        
        const canvasWidth = (state.canvas
                                .select("rect.Graph2d_Background")
                                .node() as SVGRectElement)
                                .getBBox()
                                .width;
        const canvasHeight = (state.canvas
                                .select("rect.Graph2d_Background")
                                .node() as SVGRectElement)
                                .getBBox()
                                .height;
        
        //Position the axis
        if(state.axis.position == "center"){
            positionAxisCenter(axisWidth, axisHeight, canvasWidth, canvasHeight);
            return;
        }
        positionAxis(axisWidth, axisHeight, canvasWidth, canvasHeight);
       
    }

//---------------------------------------------------------
//------------------------- Center ------------------------

    function positionAxisCenter(axisWidth:number, axisHeight:number, canvasWidth:number, canvasHeight:number){
        if(state.scale == null) return;

        let translationX = state.scale.reference.x(state.config.centerX);
        let translationY = state.scale.reference.y(state.config.centerY);

        const maxTranslationX = canvasWidth - state.config.marginEnd - 2;
        const minTranslationX = state.config.marginStart + 1;
        const maxTranslationY = canvasHeight - state.config.marginBottom - 2;
        const minTranslationY = state.config.marginTop + 1;

        if(translationX > maxTranslationX)
            translationX = maxTranslationX;
            
        if(translationX < minTranslationX)
            translationX = minTranslationX;
            
        if(translationY > maxTranslationY)
            translationY = maxTranslationY;

        if(translationY < minTranslationY)
            translationY = minTranslationY;

        state.canvas    //Appends a group to set the background of each tick label
            .selectAll("g.tick")
            .append("g")
            .classed("Graph2D_tick_Background");

        //set the position of the tick labels
        if(translationX < minTranslationX + axisWidth){
            const translator = scaleLinear().domain([minTranslationX+axisWidth, minTranslationX]).range([0, axisWidth+6]);
            state.canvas
                .select("g.Graph2D_AxisY")
                .selectAll("text, g.Graph2D_tick_Background")
                .style("transform", `translate(${translator(translationX)})px,0`);
        }

        if(translationY > maxTranslationY - axisHeight){
            const translator = scaleLinear().domain([maxTranslationY-axisHeight, maxTranslationY]).range([0, -axisHeight-6]);
            state.canvas
                .select(".Graph2D_AxisX")
                .selectAll("texxt, g.Graph2D_tick_Background")
                .style("transform", `translate(0,${translator(translationY)}px)`);
        }

        //Translate the axis and increase the tick size
        state.canvas
            .select("g.Graph2D_AxisX")
            .style("transform", `translate(0,${translationY}px)`)
            .selectAll("g.tick")
            .select("line")
            .attr("y2", 8)
            .style("transform", "translate(0,-4px)");

        state.canvas
            .select("g.Graph2D_AxisY")
            .style("transform", `translate(${translationX}px,0`)
            .selectAll("g.tick")
            .select("line")
            .attr("x2", 8)
            .style("transform", "translate(-4px,0)");

        //Makes invisible the tick and label at the origin
        state.canvas
            .selectAll("g.tick")
            .each((d,i,nodes)=>{
                const tick = (nodes[i] as SVGGElement);
                const text = tick.children[1] as SVGTextElement;
                const label = text.textContent as string;
                const tolerance = 1e-5;

                if(parseFloat(label)<tolerance){
                    select(tick).style("visibility", "hidden");
                }
            });

        //Creates little axis extensions to cover the margins
        state.canvas
            .select("g.Graph2D_AxisX")
            .append("line")
            .attr("stroke", state.axis.axisColor)
            .attr("x1", 0)
            .attr("x2", state.config.marginStart+2)
            .attr("y1", 0.5)
            .attr("y2", 0.5);
        
        state.canvas
            .select("g.Graph2D_AxisX")
            .append("line")
            .attr("stroke", state.axis.axisColor)
            .attr("x1", canvasWidth-state.config.marginEnd-2)
            .attr("x2", canvasWidth)
            .attr("y1", 0.5)
            .attr("y2", 0.5);
            
        state.canvas
            .select("g.Graph2D_AxisY")
            .append("line")
            .attr("stroke", state.axis.axisColor)
            .attr("x1", 0.5)
            .attr("x2", 0.5)
            .attr("y1", 0)
            .attr("y2", state.config.marginTop+2);
            
        state.canvas
            .select("g.Graph2D_AxisY")
            .append("line")
            .attr("stroke", state.axis.axisColor)
            .attr("x1", 0.5)
            .attr("x2", 0.5)
            .attr("y1", canvasHeight-state.config.marginBottom-2)
            .attr("y2", canvasHeight);
    }
 
//---------------------------------------------------------
//---------------------- Non-center  ----------------------

    function positionAxis(axisWidth:number, axisHeight:number, canvasWidth:number, canvasHeight:number){
        let translationX : number = 0;
        let translationY : number = 0;
        let extensionXStart : number = 0;
        let extensionXEnd : number = 0;
        let extensionYStart : number = 0;
        let extensionYEnd : number = 0;
        
        //Calculate the axis translation and axis extension location.
        switch(state.axis.position){
            case "bottom-left":
                translationX = axisWidth+state.config.marginStart;
                translationY = canvasHeight-axisHeight-state.config.marginBottom;
                extensionXStart = canvasWidth-state.config.marginEnd-2;
                extensionXEnd = canvasWidth;
                extensionYStart = 0;
                extensionYEnd = state.config.marginTop+2;
                break;
            
            case "bottom-right":
                translationX = canvasWidth-axisWidth-state.config.marginEnd;
                translationY = canvasHeight-axisHeight-state.config.marginBottom;
                extensionXStart = 0;
                extensionXEnd = state.config.marginStart+2;
                extensionYStart = 0;
                extensionYEnd = state.config.marginTop+2;
                break;

            case "top-left":
                translationX = axisWidth+state.config.marginStart;
                translationY = axisHeight+state.config.marginTop;
                extensionXStart = canvasWidth-state.config.marginEnd-2;
                extensionXEnd = canvasWidth;
                extensionYStart = canvasHeight-state.config.marginBottom-2;
                extensionYEnd = canvasHeight;
                break;

            case "top-right":
                translationX = canvasWidth-axisWidth-state.config.marginEnd;
                translationY = axisHeight+state.config.marginTop;
                extensionXStart = 0;
                extensionXEnd = state.config.marginStart;
                extensionYStart = canvasHeight-state.config.marginBottom-2;
                extensionYEnd = canvasHeight;
                break;
        }

        state.canvas
            .select("g.Graph2D_AxisX")
            .style("transform", `translate(0,${translationY}px)`)
            .append("line")
            .attr("stroke", state.axis.axisColor)
            .attr("x1", extensionXStart)
            .attr("x2", extensionXEnd)
            .attr("y1", 0.5)
            .attr("y2", 0.5);
        
        state.canvas
            .select("g.Graph2D_AxisY")
            .style("transform", `translate(${translationX}px,0)`)
            .append("line")
            .attr("stroke", state.axis.axisColor)
            .attr("x1", 0.5)
            .attr("x2", 0.5)
            .attr("y1", extensionYStart)
            .attr("y2", extensionYEnd);
    }

//---------------------------------------------------------

    return compute;

}

export default Axis;