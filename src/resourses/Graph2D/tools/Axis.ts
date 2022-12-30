import { Axis, NumberValue, axisBottom, axisLeft, axisRight, axisTop, scaleLinear, select, Selection} from "d3";
import { Axis_Color_Options, Axis_Opacity_Options, Graph2D_Type, Graph2D_AxisPosition, Graph2D_AxisType, Axis_Overlap, Axis_Dynamic, Axis_Units } from "../Graph2D";
import { Axis_Type, Compute_Background_Props, Compute_Mask_Props, Method_Generator_Props, Set_Proxi_Props } from "../Graph2D_Types/types";

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

        //Remove old mask
        state.canvas
            .select("defs")
            .select("g.Graph2D_Mask")
            .remove();

        state.canvas
            .select("g.Graph2D_Axis_Proxi")
            .remove();

        if(state.axis.position==="center" || state.axis.position==="bottom-left" || state.axis.position==="bottom-right")    axisX = axisBottom(state.scale.inner.x);
        else    axisX = axisTop(state.scale.inner.x);

        if(state.axis.position==="center" || state.axis.position==="bottom-left" || state.axis.position==="top-left")    axisY = axisLeft(state.scale.inner.y);
        else    axisY = axisRight(state.scale.inner.y);
        
        axisX.tickSizeOuter(0);
        axisY.tickSizeOuter(0);

        //Generate the new axis and save its size
        const axisWidth = (axisGroup
                            .append("g")
                            .classed("Graph2D_AxisY", true)
                            .call(axisY)
                            .call(element=>{
                                if(state.axis.yUnit == null) return;
                                setAxisUnits(element, state.axis.yUnit);
                            })
                            .node() as SVGGElement)
                            .getBBox()
                            .width;
            
        const axisHeight = (axisGroup
                            .append("g")
                            .classed("Graph2D_AxisX", true)
                            .call(axisX)
                            .call(element=>{
                                if(state.axis.xUnit == null) return;
                                setAxisUnits(element, state.axis.xUnit);
                            })
                            .node() as SVGGElement)
                            .getBBox()
                            .height;
     
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


        //Position the axis
        if(state.axis.position == "center"){
            positionAxisCenter(axisWidth, axisHeight, canvasWidth, canvasHeight);
            return;
        }
        
        positionAxis(axisWidth, axisHeight, canvasWidth, canvasHeight);

    }

    function setAxisUnits(element:Selection<SVGGElement, unknown, null, undefined>, unit:string){
        element
        .selectAll("text")
        .each((d,i,nodes)=>{
            const text = nodes[i] as SVGTextElement;
            const label = select(text).text();

            select(text).text(`${label}${unit}`);
        });
    }

//---------------------------------------------------------
//------------------------- Center ------------------------

    function positionAxisCenter(axisWidth:number, axisHeight:number, canvasWidth:number, canvasHeight:number){
        if(state.scale == null) return;

        let translationX = state.scale.reference.x(state.config.centerX);
        let translationY = state.scale.reference.y(state.config.centerY);
        let labelTranslationX = 0;
        let labelTranslationY = 0;
        const maxTranslationX = canvasWidth - state.config.marginEnd - 2;
        const minTranslationX = state.config.marginStart + 1;
        const maxTranslationY = canvasHeight - state.config.marginBottom - 2;
        const minTranslationY = state.config.marginTop + 1;

        if(state.axis.yAxisContained){
            if(translationX > maxTranslationX)
                translationX = maxTranslationX;
                
            if(translationX < minTranslationX)
                translationX = minTranslationX;
        }
        
        if(state.axis.xAxisContained){
            if(translationY > maxTranslationY)
                translationY = maxTranslationY;
    
            if(translationY < minTranslationY)
                translationY = minTranslationY;
        }

        //set the position of the tick labels
        if(state.axis.yLabelDynamic){
            if(translationX < minTranslationX + axisWidth){
                const translator = scaleLinear().domain([minTranslationX+axisWidth, minTranslationX]).range([0, axisWidth+6]);
                labelTranslationX = translator(translationX<minTranslationX?minTranslationX:translationX);
                state.canvas
                    .select("g.Graph2D_AxisY")
                    .selectAll("text")
                    .attr("transform", `translate(${labelTranslationX},0)`);
            }
        }

        if(state.axis.xLabelDynamic){
            if(translationY > maxTranslationY - axisHeight){
                const translator = scaleLinear().domain([maxTranslationY-axisHeight, maxTranslationY]).range([0, -axisHeight-6]);
                labelTranslationY = translator(translationY>maxTranslationY?maxTranslationY:translationY);
                state.canvas
                    .select(".Graph2D_AxisX")
                    .selectAll("text")
                    .attr("transform", `translate(0,${labelTranslationY})`);
            }
        }
        
        if(state.background.bgOpacity < 1)
            setupMask(canvasWidth, canvasHeight);


        //Computes translation, tick increase and mask positions
        state.canvas
            .select("g.Graph2D_AxisX")
            .attr("transform", `translate(0,${translationY})`)
            .selectAll("g.tick")
            .each((d,i,nodes)=>{
                const tick = nodes[i] as SVGGElement;

                //Transform the ticks
                select(tick)
                    .select("line")
                    .attr("y2", 8)
                    .attr("transform", "translate(0,-4)");

                const tolerance = 1e-5;
                const label = select(tick)
                                .select("text")
                                .text();
                                
                     
                //If is the tick labeled zero, make invisible and dont compute the mask in this position
                if(parseFloat(label)<tolerance){
                    select(tick).attr("visibility", "hidden");
                    return;
                }

                if(state.axis.xAxisOverlap) return;
                
                if(state.background.bgOpacity === 1)
                    computeLabelBackground({
                        tick,
                        labelTranslationX : 0,
                        labelTranslationY
                    });
                else
                    computeMask({
                        tick,
                        translationX : 0,
                        translationY,
                        labelTranslationX : 0,
                        labelTranslationY,
                        axis : "x",
                        label
                    });
            });

        state.canvas
            .select("g.Graph2D_AxisY")
            .attr("transform", `translate(${translationX},0)`)
            .selectAll("g.tick")
            .each((d,i,nodes)=>{
                const tick = nodes[i] as SVGGElement;

                //Transform the ticks
                select(tick)
                    .select("line")
                    .attr("x2", 8)
                    .attr("transform", "translate(-4,0)");

                const tolerance = 1e-5;
                const label = select(tick)
                                .select("text")
                                .text();
                     
                //If is the tick labeled zero, make invisible and dont compute the mask in this position
                if(parseFloat(label)<tolerance){
                    select(tick).attr("visibility", "hidden");
                    return;
                }

                if(state.axis.yAxisOverlap) return;
                if(state.background.bgOpacity === 1)
                    computeLabelBackground({
                        tick,
                        labelTranslationX,
                        labelTranslationY : 0
                    });
                else
                    computeMask({
                        tick,
                        translationX,
                        translationY : 0,
                        labelTranslationX,
                        labelTranslationY : 0,
                        axis : "y",
                        label
                    });
            });

        if(!state.axis.yAxisOverlap && 
            state.axis.overlapPriority==="Y" &&
            state.background.bgOpacity === 1){
            const auxData = [1,0];
            state.canvas
                .select("g.Graph2D_Axis")
                .selectChildren()
                .data(auxData)
                .sort();
        }

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


            //Computes the mask for axis overlap

    }
 
//---------------------- Aux Center Functions  ----------------------

    function computeLabelBackground({tick, labelTranslationX, labelTranslationY} : Compute_Background_Props){
        const size = (select(tick)
                        .select("text")
                        .node() as SVGTextElement)
                        .getBBox();

        select(tick)    //Create the label background
            .append("rect")
            .classed("Graph2D_Label_Background", true)
            .attr("fill", state.background.bgColor)
            .attr("opacity", state.background.bgOpacity)
            .attr("opacity", 1)
            .attr("x", size.x-1)
            .attr("y", size.y-1)
            .attr("width", size.width+2)
            .attr("height", size.height+2)
            .attr("transform", `translate(${labelTranslationX}, ${labelTranslationY})`);

        const auxData = [0,2,1] //Aux data to perform a sort
        select(tick)
            .selectChildren()
            .data(auxData)
            .sort();
    }

    //---------------------------------------------------------

    function computeMask({tick, translationX, translationY, labelTranslationX, labelTranslationY, axis, label} : Compute_Mask_Props){
        const tickPosition = extractPosition(tick);
        const labelSize = (select(tick)
                            .select("text")
                            .node() as SVGTextElement)
                            .getBBox();
        
        const absolutePositionX = translationX + tickPosition[0] + labelTranslationX;
        const absolutePositionY = translationY + tickPosition[1] + labelTranslationY;

        state.canvas
            .select("mask.Graph2D_Full_Mask")
            .append("rect")
            .attr("fill", "#00000")
            .attr("x", labelSize.x-1)
            .attr("y", labelSize.y-1)
            .attr("width", labelSize.width+2)
            .attr("height", labelSize.height+2)
            .attr("transform", `translate(${absolutePositionX}, ${absolutePositionY})`);

        setProxi({
            tick,
            axis,
            label,
            absolutePositionX,
            absolutePositionY,
            labelSize
        })
    }

    //---------------------------------------------------------

    function setProxi({tick, axis, label, absolutePositionX, absolutePositionY, labelSize} : Set_Proxi_Props){
        const font_size = state.canvas
        .select(`g.Graph2D_Axis${axis.toUpperCase()}`)
        .attr("font-size");
        
        const font_family = state.canvas
                .select(`g.Graph2D_Axis${axis.toUpperCase()}`)
                .attr("font-family");

        const text_anchor = state.canvas
                .select(`g.Graph2D_Axis${axis.toUpperCase()}`)
                .attr("text-anchor");

        const dy = select(tick)
            .select("text")
            .attr("dy");
        
        const position = select(tick)
            .select("text")
            .attr(axis==="x"?"y":"x");

        state.canvas
            .select(`g.Graph2D_Proxi${axis.toUpperCase()}`)
            .attr("font-size", font_size)
            .attr("font-family", font_family)
            .attr("text-anchor", text_anchor)
            .append("text")
            .attr("fill", state.axis.xLabelColor)
            .attr("opacity", state.axis.xLabelOpacity)
            .attr(axis==="x"?"y":"x", position)
            .attr("dy", dy)
            .attr("transform", `translate(${absolutePositionX}, ${absolutePositionY})`)
            .text(label);

        if(state.axis.overlapPriority === axis.toUpperCase()){
            state.canvas
                .select("mask.Graph2D_Partial_Mask")
                .append("rect")
                .attr("fill", "#00000")
                .attr("x", labelSize.x-1)
                .attr("y", labelSize.y-1)
                .attr("width", labelSize.width+2)
                .attr("height", labelSize.height+2)
                .attr("transform", `translate(${absolutePositionX}, ${absolutePositionY})`);
        
            state.canvas
                .select(`g.Graph2D_Proxi${axis==="x"?"Y":"X"}`)
                .attr("mask", `url(#Graph2D_Partial_Mask_${state.graphID})`);
        }
    }

    //---------------------------------------------------------
    
    function setupMask(canvasWidth:number, canvasHeight:number){
        state.canvas    //Create the new mask
            .select("defs")
            .append("g")
            .classed("Graph2D_Mask", true)
            .append("mask")
            .classed("Graph2D_Full_Mask", true)
            .attr("id", `Graph2D_Full_Mask_${state.graphID}`)
            .append("rect")
            .attr("fill", "#ffffff")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight);
    
        state.canvas
            .select("g.Graph2D_Mask")
            .append("mask")
            .classed("Graph2D_Partial_Mask", true)
            .attr("id", `Graph2D_Partial_Mask_${state.graphID}`)
            .append("rect")
            .attr("fill", "#ffffff")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight);

        state.canvas
            .append("g")
            .classed("Graph2D_Axis_Proxi", true);

        //Attach the new mask
        state.canvas
            .select("g.Graph2D_Grid")
            .attr("mask", `url(#Graph2D_Full_Mask_${state.graphID})`);
            
        state.canvas
            .select("g.Graph2D_Axis")
            .attr("mask", `url(#Graph2D_Full_Mask_${state.graphID})`);

        //Create a proxi axis to render on top of the mask
        state.canvas
            .select("g.Graph2D_Axis_Proxi")
            .append("g")
            .classed("Graph2D_ProxiX", true);

        state.canvas
            .select("g.Graph2D_Axis_Proxi")
            .append("g")
            .classed("Graph2D_ProxiY", true);
    }

    //---------------------------------------------------------

    function extractPosition(element :SVGGElement) : [number, number]{
        const position : [number, number] = [0,0];
        const elementTransform = select(element).attr("transform");

        if(elementTransform != null){
            const extractedPosition = elementTransform.replace("translate(","").replace(")","").split(",");
            position[0] = parseFloat(extractedPosition[0]);
            position[1] = parseFloat(extractedPosition[1]);
        }

        return position;
    }

    //---------------------------------------------------------


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
            .attr("transform", `translate(0,${translationY})`)
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
            .attr("transform", `translate(${translationX},0)`)
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
//---------------------------------------------------------












/*------------- Customization functions -----------------*/

//---------------------------------------------------------
//--------------------- Axis Type -------------------------

    function axisType(type : Graph2D_AxisType) : Graph2D_Type{
        if(type === state.axis.type) return graphHandler;
        if(state.render == null) return graphHandler;

            //Maybe later
        //state.axis.type = type;
        //state.render();

        return graphHandler;
    }

    function getAxisType():Graph2D_AxisType{
        return state.axis.type;
    }

//---------------------------------------------------------
//------------------- Axis Position -----------------------

    function axisPosition(position : Graph2D_AxisPosition) : Graph2D_Type{
        if(position === state.axis.position) return graphHandler;
        if(state.render == null) return graphHandler;
        
        state.axis.position = position;
        state.render();

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

        state.canvas
            .select("g.Graph2D_ProxiX")
            .selectAll("text")
            .attr("fill", state.axis.xLabelColor);
            
        ticksY
            .select("line")
            .attr("stroke", state.axis.yTickColor);

        ticksY
            .select("text")
            .attr("fill", state.axis.yLabelColor);

        state.canvas
            .select("g.Graph2D_ProxiY")
            .selectAll("text")
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

        state.canvas
            .select("g.Graph2D_ProxiX")
            .selectAll("text")
            .attr("opacity", state.axis.xLabelOpacity);
            
        ticksY
            .select("line")
            .attr("opacity", state.axis.yTickOpacity);

        ticksY
            .select("text")
            .attr("opacity", state.axis.yLabelOpacity);

        state.canvas
            .select("g.Graph2D_ProxiY")
            .selectAll("text")
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
//-------------------- Axis Overlap -----------------------

    function axisOverlap({x, y, priority} : Axis_Overlap) : Graph2D_Type{
        if(state.axis.compute == null) return graphHandler;
        if(x==null && y==null && priority == null) return graphHandler;
        if(x===state.axis.xAxisOverlap && y===state.axis.yAxisOverlap && priority===state.axis.overlapPriority) return graphHandler;

        if(x!=null) state.axis.xAxisOverlap = x;
        if(y!=null) state.axis.yAxisOverlap = y;
        if(priority!=null) state.axis.overlapPriority = priority;

        state.axis.compute();

        return graphHandler;
    }

    function getAxisOverlap() : Axis_Overlap{
        return {
            x : state.axis.xAxisOverlap,
            y : state.axis.yAxisOverlap,
            priority : state.axis.overlapPriority
        };
    }

//---------------------------------------------------------
//--------------------- Axis Dynamic ----------------------

function axisDynamic({xContained, yContained, xDynamic, yDynamic}:Axis_Dynamic) : Graph2D_Type{
    if(state.render == null) return graphHandler;
    if(xContained===state.axis.xAxisContained && yContained===state.axis.yAxisContained && xDynamic===state.axis.xLabelDynamic && yDynamic===state.axis.yLabelDynamic) return graphHandler;
    if(xContained==null && yContained==null && xDynamic==null && yDynamic==null) return graphHandler;

    if(xContained!=null) state.axis.xAxisContained = xContained;
    if(yContained!=null) state.axis.yAxisContained = yContained;
    if(xDynamic!=null) state.axis.xLabelDynamic = xDynamic;
    if(yDynamic!=null) state.axis.yLabelDynamic = yDynamic;

    state.render();


    return graphHandler;
}

function getAxisDynamic():Axis_Dynamic{
    return {
        xContained : state.axis.xAxisContained,
        yContained : state.axis.yAxisContained,
        xDynamic : state.axis.xLabelDynamic,
        yDynamic : state.axis.yLabelDynamic
    }
}

//---------------------------------------------------------
//--------------------- Axis Units ------------------------

    function axisUnits({x, y}:Axis_Units) : Graph2D_Type{
        if(state.render == null) return graphHandler;
        if(x===undefined && y===undefined) return graphHandler; //This time check for undefined instead of null because in this case the value can be set to null
        if(x===state.axis.xUnit && y===state.axis.yUnit) return graphHandler;

        if(x!==undefined) state.axis.xUnit = x;
        if(y!==undefined) state.axis.yUnit = y;

        state.render();

        return graphHandler;
    }

    function getAxisUnits() : Axis_Units {
        return {
            x : state.axis.xUnit,
            y : state.axis.yUnit
        }
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
        getAxisOpacity,
        axisOverlap,
        getAxisOverlap,
        axisDynamic,
        getAxisDynamic,
        axisUnits,
        getAxisUnits
    };

}

export default Axis;