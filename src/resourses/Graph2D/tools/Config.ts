import { Grap2D_Type, Graph2D_AxisPosition, Graph2D_AxisType } from "../Graph2D";
import { Axis_Color_Options, Axis_Opacity_Options, Config_Type, Method_Generator_Props } from "../Graph2D_Types/types";

function Config({graphHandler, state}:Method_Generator_Props) : Config_Type{

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
//---------------- Axis Color & Opacity -------------------

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
            .select("path")
            .attr("stroke", state.axis.xAxisColor);
        
        state.canvas
            .select("g.Graph2D_AxisY")
            .select("path")
            .attr("stroke", state.axis.yAxisColor);





        return graphHandler;
    }

    function axisOpacity(options : Axis_Opacity_Options) : Grap2D_Type{

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
        axisType,
        getAxisType,
        axisPosition,
        getAxisPosition
    };
}

export default Config;