import { scaleLinear, axisBottom, axisLeft, axisRight, axisTop } from "d3";
import { Grapg2D_State, Scale_Type, _GetScale_Type } from "../Graph2D_Types/types";

function Scale(state : Grapg2D_State) : Scale_Type{
    let inner = {x:scaleLinear(), y:scaleLinear()};
    let reference = {x:scaleLinear(), y:scaleLinear()};
    const domainStartX = -state.config.width/2 - state.config.centerX;
    const domainEndX   = state.config.width/2 - state.config.centerX;
    const domainStartY = -state.config.height/2 - state.config.centerY;
    const domainEndY   = state.config.height/2 - state.config.centerY;

//---------------------------------------------------------
    function compute(){
        const {rangeStartX,rangeEndX,rangeStartY,rangeEndY} = _getRange();

        switch(state.axis.type){
            case "rectangular":
                inner.x = scaleLinear()
                            .domain([domainStartX, domainEndX])
                            .range([rangeStartX, rangeEndX]);
            
                inner.y = scaleLinear()
                            .domain([domainStartY, domainEndY])
                            .range([rangeStartY, rangeEndY]);
                
                reference.x = scaleLinear()
                                .domain([-state.config.width/2, state.config.width/2])
                                .range([rangeStartX, rangeEndX]);

                reference.y = scaleLinear()
                                .domain([-state.config.height/2, state.config.height/2])
                                .range([rangeStartY, rangeEndY]);
                break;
            
            case "polar":
                break;
            
            case "x-log":
                break;
            
            case "y-log":
                break;

            case "log-log":
                break;
        }
    }

//---------------------------------------------------------

    function _getRange() : _GetScale_Type{
        const fullSizeRange = (state.canvas
                                .select("rect.Graph2d_Background")
                                .node() as SVGRectElement)
                                .getBBox();
        const rangeWidth = fullSizeRange.width;
        const rangeHeight = fullSizeRange.height;

        
        //Aux calculations, usefull to take into acount axis size in the effective range calculation
        const auxScaleX = scaleLinear().domain([domainStartX,domainEndX]).range([0,rangeWidth]);
        const auxScaleY = scaleLinear().domain([domainStartY,domainEndY]).range([0,rangeHeight])
        let auxAxisX : any;
        let auxAxisY : any;

        if(state.axis.position==="center" || state.axis.position==="bottom-left" || state.axis.position==="bottom-right")    auxAxisX = axisBottom(auxScaleX);
        else    auxAxisX = axisTop(auxScaleX);

        if(state.axis.position==="center" || state.axis.position==="bottom-left" || state.axis.position==="top-left")    auxAxisY = axisLeft(auxScaleY);
        else    auxAxisY = axisRight(auxScaleY);

        const axisWidth = (state.canvas
            .append("g")
            .classed("Aux_AxisY", true)
            .attr("opacity", 0)
            .call(auxAxisY)
            .node() as SVGGElement)
            .getBBox()
            .width;
            
        const axisHeight = (state.canvas
            .append("g")
            .classed("Aux_AxisX", true)
            .attr("opacity", 0)
            .call(auxAxisX)
            .node() as SVGGElement)
            .getBBox()
            .height;

        state.canvas.select("g.Aux_AxisX").remove();
        state.canvas.select("g.Aux_AxisY").remove();
        
        
        
        
        //The effective range depends on the axis size position
        switch(state.axis.position){
            case "center":
                return {
                    rangeStartX : state.config.marginStart,
                    rangeEndX : rangeWidth - state.config.marginEnd,
                    rangeStartY : rangeHeight - state.config.marginBottom,
                    rangeEndY : state.config.marginTop
                };
            case "bottom-left":
                return {
                    rangeStartX : state.config.marginStart + axisWidth,
                    rangeEndX : rangeWidth - state.config.marginEnd,
                    rangeStartY : rangeHeight - axisHeight - state.config.marginBottom,
                    rangeEndY : state.config.marginTop
                }
            case "bottom-right":
                return {
                    rangeStartX : state.config.marginStart,
                    rangeEndX : rangeWidth - axisWidth - state.config.marginEnd,
                    rangeStartY : rangeHeight - axisHeight - state.config.marginBottom,
                    rangeEndY : state.config.marginTop
                }
            case "top-left":
                return {
                    rangeStartX : state.config.marginStart + axisWidth,
                    rangeEndX : rangeWidth - state.config.marginEnd,
                    rangeStartY : rangeHeight - state.config.marginBottom,
                    rangeEndY : axisHeight + state.config.marginTop
                }
            case "top-right":
                return {
                    rangeStartX : state.config.marginStart,
                    rangeEndX : rangeWidth - axisWidth - state.config.marginEnd,
                    rangeStartY : rangeHeight - state.config.marginBottom,
                    rangeEndY : axisHeight + state.config.marginTop
                }
        }
    }

//---------------------------------------------------------

    return {
        inner,
        reference,
        compute
    };
}

export default Scale;