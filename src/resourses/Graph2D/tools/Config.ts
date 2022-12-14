import { Axis_Color_Options, Axis_Opacity_Options, Grap2D_Type, Graph2D_AxisPosition, Graph2D_AxisType } from "../Graph2D";
import { Config_Type, Method_Generator_Props } from "../Graph2D_Types/types";

function Config({graphHandler, state}:Method_Generator_Props) : Config_Type{

//--------------------- Canvas ----------------------------

    function canvas() : SVGGElement{
        return state.canvas.node() as SVGGElement;
    }

//---------------------------------------------------------
//--------------------- Axis Type -------------------------

    function axisType(type : Graph2D_AxisType) : Grap2D_Type{
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

    function axisPosition(position : Graph2D_AxisPosition) : Grap2D_Type{
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

    function axisColor(options : Axis_Color_Options) : Grap2D_Type{
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

    function axisOpacity(options : Axis_Opacity_Options) : Grap2D_Type{
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
        canvas,
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

export default Config;