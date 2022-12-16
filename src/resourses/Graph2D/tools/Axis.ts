import { Axis, NumberValue, axisBottom, axisLeft, axisRight, axisTop, scaleLinear, select, sort } from "d3";
import { Axis_Color_Options, Axis_Opacity_Options, Graph2D_Type, Graph2D_AxisPosition, Graph2D_AxisType } from "../Graph2D";
import { Axis_Type, Method_Generator_Props } from "../Graph2D_Types/types";

function Axis({graphHandler, state}:Method_Generator_Props) : Axis_Type{
    let axisX : Axis<NumberValue>
    let axisY : Axis<NumberValue>

//---------------------------------------------------------
//-------------------- Compute Axis------------------------

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
                                .select("rect.Graph2D_Background")
                                .node() as SVGRectElement)
                                .getBBox()
                                .width;
        const canvasHeight = (state.canvas
                                .select("rect.Graph2D_Background")
                                .node() as SVGRectElement)
                                .getBBox()
                                .height;

        //Set the color and opacity of the axis, labels and ticks
         state.canvas
            .select("g.Graph2D_AxisX")
            .select("path")
            .attr("stroke", state.axis.xAxisColor)
            .attr("opacity", state.axis.xAxisOpacity);

        state.canvas
            .select("g.Graph2D_AxisX")
            .selectAll("g.tick")
            .select("line")
            .attr("stroke", state.axis.xTickColor)
            .attr("opacity", state.axis.xTickOpacity);
        
        state.canvas
            .select("g.Graph2D_AxisX")
            .selectAll("g.tick")
            .select("text")
            .attr("fill", state.axis.xLabelColor)
            .attr("opacity", state.axis.xLabelOpacity);
            
        state.canvas
            .select("g.Graph2D_AxisY")
            .select("path")
            .attr("stroke", state.axis.yAxisColor)
            .attr("opacity", state.axis.yAxisOpacity);

        state.canvas
            .select("g.Graph2D_AxisY")
            .selectAll("g.tick")
            .select("line")
            .attr("stroke", state.axis.yTickColor)
            .attr("opacity", state.axis.yTickOpacity);
        
        state.canvas
            .select("g.Graph2D_AxisY")
            .selectAll("g.tick")
            .select("text")
            .attr("fill", state.axis.yLabelColor)
            .attr("opacity", state.axis.yLabelOpacity);

        labelBackground();

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

        //set the position of the tick labels
        if(translationX < minTranslationX + axisWidth){
            const translator = scaleLinear().domain([minTranslationX+axisWidth, minTranslationX]).range([0, axisWidth+6]);
            state.canvas
                .select("g.Graph2D_AxisY")
                .selectAll("text, g.Graph2D_Tick_Background")
                .style("transform", `translate(${translator(translationX)}px,0)`);
        }

        if(translationY > maxTranslationY - axisHeight){
            const translator = scaleLinear().domain([maxTranslationY-axisHeight, maxTranslationY]).range([0, -axisHeight-6]);
            state.canvas
                .select(".Graph2D_AxisX")
                .selectAll("text, g.Graph2D_Tick_Background")
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
                const label = select(tick)
                                .select("text")
                                .text();

                const tolerance = 1e-5;

                if(parseFloat(label)<tolerance){
                    select(tick).style("visibility", "hidden");
                }
            });

        //Creates little axis extensions to cover the margins
        state.canvas
            .select("g.Graph2D_AxisX")
            .append("line")
            .classed("Graph2D_Extension", true)
            .attr("stroke", state.axis.xAxisColor)
            .attr("opacity", state.axis.xAxisOpacity)
            .attr("x1", 0)
            .attr("x2", state.config.marginStart+2)
            .attr("y1", 0.5)
            .attr("y2", 0.5);
        
        state.canvas
            .select("g.Graph2D_AxisX")
            .append("line")
            .classed("Graph2D_Extension", true)
            .attr("stroke", state.axis.xAxisColor)
            .attr("opacity", state.axis.xAxisOpacity)
            .attr("x1", canvasWidth-state.config.marginEnd-2)
            .attr("x2", canvasWidth)
            .attr("y1", 0.5)
            .attr("y2", 0.5);
            
        state.canvas
            .select("g.Graph2D_AxisY")
            .append("line")
            .classed("Graph2D_Extension", true)
            .attr("stroke", state.axis.yAxisColor)
            .attr("opacity", state.axis.yAxisOpacity)
            .attr("x1", 0.5)
            .attr("x2", 0.5)
            .attr("y1", 0)
            .attr("y2", state.config.marginTop+2);
            
        state.canvas
            .select("g.Graph2D_AxisY")
            .append("line")
            .classed("Graph2D_Extension", true)
            .attr("stroke", state.axis.yAxisColor)
            .attr("opacity", state.axis.yAxisOpacity)
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
            .classed("Graph2D_Extension", true)
            .attr("stroke", state.axis.xAxisColor)
            .attr("opacity", state.axis.xAxisOpacity)
            .attr("x1", extensionXStart)
            .attr("x2", extensionXEnd)
            .attr("y1", 0.5)
            .attr("y2", 0.5);
        
        state.canvas
            .select("g.Graph2D_AxisY")
            .style("transform", `translate(${translationX}px,0)`)
            .append("line")
            .classed("Graph2D_Extension", true)
            .attr("stroke", state.axis.yAxisColor)
            .attr("opacity", state.axis.yAxisOpacity)
            .attr("x1", 0.5)
            .attr("x2", 0.5)
            .attr("y1", extensionYStart)
            .attr("y2", extensionYEnd);
    }

//---------------------------------------------------------
//------------------ Label Background ---------------------

    function labelBackground(){
        const sortData = [0,2,1]; //Used to sort the elemnts in the tick group

        state.canvas    //Appends a group to set the background of each tick label
            .selectAll("g.tick")
            .append("g")
            .classed("Graph2D_Tick_Background", true)
            .append("rect")
            .attr("fill", state.background.bgColor)
            .style("mix-blend-mode", "difference");

        state.canvas
            .selectAll("g.tick")
            .each((d,i,nodes)=>{
                const tick = (nodes[i] as SVGGElement);
                const size = (select(tick)
                                .select("text")
                                .node() as SVGTextElement)
                                .getBBox();

                select(tick)
                    .select("rect")
                    .attr("x", size.x-1)
                    .attr("y", size.y-1)
                    .attr("width", size.width+4)
                    .attr("height", size.height+4);
                
                select(tick)
                    .selectChildren()
                    .data(sortData)
                    .sort();
            });

    }

//---------------------------------------------------------
//---------------------------------------------------------















/*------------- Customization functions -----------------*/

//---------------------------------------------------------
//--------------------- Axis Type -------------------------

    function axisType(type : Graph2D_AxisType) : Graph2D_Type{
        if(type === state.axis.type) return graphHandler;
        if(state.scale == null) return graphHandler;
        if(state.axis.compute == null) return graphHandler;

        state.axis.type = type;
        state.scale.compute();
        state.axis.compute();

        return graphHandler;
    }

    function getAxisType():Graph2D_AxisType{
        return state.axis.type;
    }

//---------------------------------------------------------
//------------------- Axis Position -----------------------

    function axisPosition(position : Graph2D_AxisPosition) : Graph2D_Type{
        if(position === state.axis.position) return graphHandler;
        if(state.scale == null) return graphHandler;
        if(state.axis.compute == null) return graphHandler;

        state.axis.position = position;
        state.scale.compute();
        state.axis.compute();

        return graphHandler;
    }

    function getAxisPosition():Graph2D_AxisPosition{
        return state.axis.position;
    }

//---------------------------------------------------------
//--------------------- Axis Color ------------------------

    function axisColor(options : Axis_Color_Options) : Graph2D_Type{
        //Cascade the options
        if(options.axis != null){
            const newColor = options.axis;
            state.axis.xAxisColor = newColor;
            state.axis.xTickColor = newColor;
            state.axis.xLabelColor = newColor;
            state.axis.yAxisColor = newColor;
            state.axis.yTickColor = newColor;
            state.axis.yLabelColor = newColor;
        }
        if(options.xAxis != null){
            const newColor  = options.xAxis;
            state.axis.xAxisColor = newColor;
            state.axis.xTickColor = newColor;
            state.axis.xLabelColor = newColor;
        }
        if(options.yAxis != null){
            const newColor  = options.yAxis;
            state.axis.yAxisColor = newColor;
            state.axis.yTickColor = newColor;
            state.axis.yLabelColor = newColor;
        }
        if(options.xBase!=null) state.axis.xAxisColor=options.xBase;
        if(options.xTick!=null) state.axis.xTickColor=options.xTick;
        if(options.xLabel!=null) state.axis.xLabelColor=options.xLabel;
        if(options.yBase!=null) state.axis.yAxisColor=options.yBase;
        if(options.yTick!=null) state.axis.yTickColor=options.yTick;
        if(options.yLabel!=null) state.axis.yLabelColor=options.yLabel;

        ///Aply the changes
        const ticksX = state.canvas
                        .select("g.Graph2D_AxisX")
                        .selectAll("g.tick");
        const ticksY = state.canvas
                        .select("g.Graph2D_AxisY")
                        .selectAll("g.tick");
        
        state.canvas
            .select("g.Graph2D_AxisX")
            .selectAll("path, line.Graph2D_Extension")
            .attr("stroke", state.axis.xAxisColor);
        
        state.canvas
            .select("g.Graph2D_AxisY")
            .selectAll("path, line.Graph2D_Extension")
            .attr("stroke", state.axis.yAxisColor);

        ticksX
            .select("line")
            .attr("stroke", state.axis.xTickColor);

        ticksX
            .select("text")
            .attr("fill", state.axis.xLabelColor);
            
        ticksY
            .select("line")
            .attr("stroke", state.axis.yTickColor);

        ticksY
            .select("text")
            .attr("fill", state.axis.yLabelColor);


        return graphHandler;
    }

    function getAxisColor() : Axis_Color_Options{
        return {
            xBase : state.axis.xAxisColor,
            xTick : state.axis.xTickColor,
            xLabel : state.axis.xLabelColor,
            yBase : state.axis.yAxisColor,
            yTick : state.axis.yTickColor,
            yLabel : state.axis.yLabelColor
        };

    }

//---------------------------------------------------------
//-------------------- Axis Opacity -----------------------

    function axisOpacity(options : Axis_Opacity_Options) : Graph2D_Type{
        //Cascade the options
        if(options.axis != null){
            const newOpacity = options.axis;
            state.axis.xAxisOpacity = newOpacity;
            state.axis.xTickOpacity = newOpacity;
            state.axis.xLabelOpacity = newOpacity;
            state.axis.yAxisOpacity = newOpacity;
            state.axis.yTickOpacity = newOpacity;
            state.axis.yLabelOpacity = newOpacity;
        }
        if(options.xAxis != null){
            const newOpacity  = options.xAxis;
            state.axis.xAxisOpacity = newOpacity;
            state.axis.xTickOpacity = newOpacity;
            state.axis.xLabelOpacity = newOpacity;
        }
        if(options.yAxis != null){
            const newOpacity  = options.yAxis;
            state.axis.yAxisOpacity = newOpacity;
            state.axis.yTickOpacity = newOpacity;
            state.axis.yLabelOpacity = newOpacity;
        }
        if(options.xBase!=null) state.axis.xAxisOpacity=options.xBase;
        if(options.xTick!=null) state.axis.xTickOpacity=options.xTick;
        if(options.xLabel!=null) state.axis.xLabelOpacity=options.xLabel;
        if(options.yBase!=null) state.axis.yAxisOpacity=options.yBase;
        if(options.yTick!=null) state.axis.yTickOpacity=options.yTick;
        if(options.yLabel!=null) state.axis.yLabelOpacity=options.yLabel;

        ///Aply the changes
        const ticksX = state.canvas
                        .select("g.Graph2D_AxisX")
                        .selectAll("g.tick");
        const ticksY = state.canvas
                        .select("g.Graph2D_AxisY")
                        .selectAll("g.tick");
        
        state.canvas
            .select("g.Graph2D_AxisX")
            .selectAll("path, line.Graph2D_Extension")
            .attr("opacity", state.axis.xAxisOpacity);
        
        state.canvas
            .select("g.Graph2D_AxisY")
            .selectAll("path, line.Graph2D_Extension")
            .attr("opacity", state.axis.yAxisOpacity);

        ticksX
            .select("line")
            .attr("opacity", state.axis.xTickOpacity);

        ticksX
            .select("text")
            .attr("opacity", state.axis.xLabelOpacity);
            
        ticksY
            .select("line")
            .attr("opacity", state.axis.yTickOpacity);

        ticksY
            .select("text")
            .attr("opacity", state.axis.yLabelOpacity);

        
        return graphHandler;
    }

    function getAxisOpacity() : Axis_Opacity_Options{
        return {
            xBase : state.axis.xAxisOpacity,
            xTick : state.axis.xTickOpacity,
            xLabel : state.axis.xLabelOpacity,
            yBase : state.axis.yAxisOpacity,
            yTick : state.axis.yTickOpacity,
            yLabel : state.axis.yLabelOpacity
        };
    }

//---------------------------------------------------------

    return {
        compute,
        axisType,
        getAxisType,
        axisPosition,
        getAxisPosition,
        axisColor,
        getAxisColor,
        axisOpacity,
        getAxisOpacity
    };

}

export default Axis;