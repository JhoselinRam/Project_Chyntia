import { select, scaleLinear, axisBottom, axisLeft, axisRight, axisTop } from "d3";
import { Scale, ScaleProps, ScaleType, SetRangeType } from "../../Graph2D_types/types";


function setupScale({svg, width, height, centerX, centerY, axisType, axisPosition, marginStart, marginTop, marginEnd, marginBottom}:ScaleProps) : ScaleType{

    const domainWidth  = width>0? width : (width===0? 0.1 : -width);
    const domainHeight = height>0? height : (height===0? 0.1 : -height);
    const domainStartX = -domainWidth/2 - centerX;
    const domainEndX   = domainWidth/2 - centerX;
    const domainStartY = -domainHeight/2 - centerY;
    const domainEndY   = domainHeight/2 - centerY;
    let scale:Scale = {x:scaleLinear(), y:scaleLinear()}
    let reference:Scale = {x:scaleLinear(), y:scaleLinear()}

//------------------------------------------------------------------
//------------------------------------------------------------------

    function setScale(){

        let rangeStartX : number;
        let rangeEndX : number;
        let rangeStartY : number;
        let rangeEndY : number;

        ({rangeStartX, rangeEndX, rangeStartY, rangeEndY} = setRange());
        
        switch(axisType){
            case "rectangular":
                scale.x = scaleLinear()
                            .domain([domainStartX, domainEndX])
                            .range([rangeStartX, rangeEndX]);
            
                scale.y = scaleLinear()
                            .domain([domainStartY, domainEndY])
                            .range([rangeStartY, rangeEndY]);
                
                reference.x = scaleLinear()
                                .domain([-domainWidth/2, domainWidth/2])
                                .range([rangeStartX, rangeEndX]);

                reference.y = scaleLinear()
                                .domain([-domainHeight/2, domainHeight/2])
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

        return {scale, reference};
    }

//------------------------------------------------------------------
//------------------------------------------------------------------


    function setRange() : SetRangeType{
        const range : SetRangeType = {rangeStartX:0, rangeEndX:0, rangeStartY:0, rangeEndY:0}
        if(svg.current == null) return range;

        const rangeWidth   = svg.current.clientWidth;
        const rangeHeight  = svg.current.clientHeight;
        const auxScaleX = scaleLinear().domain([domainStartX,domainEndX]).range([0,rangeWidth]);
        const auxScaleY = scaleLinear().domain([domainStartY,domainEndY]).range([0,rangeHeight])
        let auxAxisX : any;
        let auxAxisY : any;

        if(axisPosition==="center" || axisPosition==="bottom-left" || axisPosition==="bottom-right")    auxAxisX = axisBottom(auxScaleX);
        else    auxAxisX = axisTop(auxScaleX);

        if(axisPosition==="center" || axisPosition==="bottom-left" || axisPosition==="top-left")    auxAxisY = axisLeft(auxScaleY);
        else    auxAxisY = axisRight(auxScaleY);

        select(svg.current)
            .select("g.Graph2D_Axis")
            .append("g")
            .classed("Graph2D_AxisX", true)
            .call(auxAxisX)
            .attr("opacity", 0);
            
        select(svg.current)
            .select("g.Graph2D_Axis")
            .append("g")
            .classed("Graph2D_AxisY", true)
            .call(auxAxisY)
            .attr("opacity", 0);

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

        switch(axisPosition){
            case "center":
                range.rangeStartX = marginStart;
                range.rangeEndX = rangeWidth - marginEnd;
                range.rangeStartY = rangeHeight - marginBottom;
                range.rangeEndY = marginTop;
                break;
            
            case "bottom-left":
                range.rangeStartX = marginStart + offsetX;
                range.rangeEndX = rangeWidth - marginEnd;
                range.rangeStartY = rangeHeight - marginBottom - offsetY;
                range.rangeEndY = marginTop;
                break;

            case "bottom-right":
                range.rangeStartX = marginStart;
                range.rangeEndX = rangeWidth - marginEnd - offsetX;
                range.rangeStartY = rangeHeight - marginBottom - offsetY;
                range.rangeEndY = marginTop;
                break;
                    
            case "top-left":
                range.rangeStartX = marginStart + offsetX;
                range.rangeEndX = rangeWidth - marginEnd;
                range.rangeStartY = rangeHeight - marginBottom;
                range.rangeEndY = marginTop + offsetY;
                break;
                        
            case "top-right":
                range.rangeStartX = marginStart;
                range.rangeEndX = rangeWidth - marginEnd - offsetX;
                range.rangeStartY = rangeHeight - marginBottom;
                range.rangeEndY = marginTop + offsetY;
                break;
        }


        select(svg.current)
            .select("g.Graph2D_AxisX")
            .remove();

        select(svg.current)
            .select("g.Graph2D_AxisY")
            .remove();

        
        return range;
    }

//------------------------------------------------------------------
//------------------------------------------------------------------

    return {setScale};
}

export default setupScale;