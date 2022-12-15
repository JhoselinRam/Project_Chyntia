import { Canvas_Size, Center_Type, Graph2D_Type } from "../Graph2D";
import { Config_Type, Method_Generator_Props } from "../Graph2D_Types/types";

function Config({graphHandler, state}:Method_Generator_Props) : Config_Type{

//--------------------- Canvas ----------------------------

    function canvas() : SVGGElement{
        return state.canvas.node() as SVGGElement;
    }

//---------------------------------------------------------
//------------------- Width & Height ----------------------

    function size({width, height}:Canvas_Size) : Graph2D_Type{
        if(state.scale == null || state.axis.compute == null) return graphHandler;
        if(width===state.config.width && height===state.config.height) return graphHandler;

        if(width != null) state.config.width = width;
        if(height != null) state.config.height = height;

        state.scale.compute();
        state.axis.compute();

        return graphHandler;
    }

    function getSize() : Canvas_Size{
        return {
            width : state.config.width,
            height : state.config.height 
        };
    }

//---------------------------------------------------------
//---------------Relative Width & Height ------------------

    function relativeSize({width, height}:Canvas_Size) : Graph2D_Type{
        if(state.render == null) return graphHandler;
        if(width === state.config.relativeWidth && height === state.config.relativeHeight) return graphHandler;

        if(width != null) state.config.relativeWidth = width < 0 ? 0 : width;
        if(height != null) state.config.relativeHeight = height < 0 ? 0 : height;

        state.render();
        
        return graphHandler;

    }

    function getRelativeSize() : Canvas_Size{
        return{
            width : state.config.relativeWidth,
            height : state.config.relativeHeight
        }
    }

//---------------------------------------------------------
//--------------------- Center ----------------------------

    function center({x, y}:Center_Type) : Graph2D_Type{
        if(state.scale == null || state.axis.compute == null) return graphHandler;
        if(x===state.config.centerX && y===state.config.centerY) return graphHandler;

        if(x != null) state.config.centerX = x;
        if(y != null) state.config.centerY = y;

        state.scale.compute();
        state.axis.compute();

        return graphHandler;
    }   
    
    function getCenter() : Center_Type{
        return {
            x : state.config.centerX,
            y : state.config.centerY
        }
    }

//---------------------------------------------------------
//----------------------- Margin --------------------------

    //---------------------------------------------------------



    //---------------------------------------------------------



    //---------------------------------------------------------



    //---------------------------------------------------------



//---------------------------------------------------------

    return {
        canvas,
        size,
        getSize,
        relativeSize,
        getRelativeSize,
        center,
        getCenter
    };
}

export default Config;