import { Axis, NumberValue, axisBottom, axisLeft, axisRight, axisTop } from "d3";
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

        if(state.axis.position==="center" || state.axis.position==="bottom-left" || state.axis.position==="bottom-right")    axisX = axisBottom(state.scale?.inner.x);
        else    axisX = axisTop(state.scale?.inner.x);

        if(state.axis.position==="center" || state.axis.position==="bottom-left" || state.axis.position==="top-left")    axisY = axisLeft(state.scale?.inner.y);
        else    axisY = axisRight(state.scale?.inner.y);

        axisX.tickSizeOuter(0);
        axisY.tickSizeOuter(0);

            //Generate the new axis
        axisGroup
            .append("g")
            .classed("Graph2D_AxisX", true)
            .attr("opacity", state.axis.opacity)
            .attr("color", state.axis.color)
            .call(axisX);
            
        axisGroup
            .append("g")
            .classed("Graph2D_AxisY", true)
            .attr("opacity", state.axis.opacity)
            .attr("color", state.axis.color)
            .call(axisY);
        }

//---------------------------------------------------------

    return compute;

}

export default Axis;