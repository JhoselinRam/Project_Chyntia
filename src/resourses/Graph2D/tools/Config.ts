import { Canvas_Size, Center_Type, Graph2D_Type, Margin_Type, Relative_Position } from "../Graph2D";
import { Config_Type, Method_Generator_Props } from "../Graph2D_Types/types";

function Config({graphHandler, state}:Method_Generator_Props) : Config_Type{

//--------------------- Canvas ----------------------------

    function canvas() : SVGGElement{
        return state.canvas.node() as SVGGElement;
    }

//---------------------------------------------------------
//------------------- Width & Height ----------------------

    function size({width, height}:Canvas_Size) : Graph2D_Type{
        if(state.render == null) return graphHandler;
        if(width===state.config.width && height===state.config.height) return graphHandler;
        if(width==null && height==null) return graphHandler;

        if(width != null) state.config.width = width;
        if(height != null) state.config.height = height;

        state.render();

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
        if(state.fullRender == null) return graphHandler;
        if(width === state.config.relativeWidth && height === state.config.relativeHeight) return graphHandler;
        if(width==null && height==null) return graphHandler;

        if(width != null) state.config.relativeWidth = width < 0 ? 0 : width;
        if(height != null) state.config.relativeHeight = height < 0 ? 0 : height;

        state.fullRender();
        
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
        if(state.render == null) return graphHandler;
        if(x===state.config.centerX && y===state.config.centerY) return graphHandler;
        if(x==null && y==null) return graphHandler;

        if(x != null) state.config.centerX = x;
        if(y != null) state.config.centerY = y;

        state.render();

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

    function margin({left, right, top, bottom} : Margin_Type) : Graph2D_Type{
        if(state.render == null) return graphHandler;
        if(left === state.config.marginStart && 
           right === state.config.marginEnd &&
           top === state.config.marginTop &&
           bottom === state.config.marginBottom) return  graphHandler;
        if(left==null && right==null && top==null && bottom==null) return graphHandler;

        if(left!=null) state.config.marginStart = left;
        if(right!=null) state.config.marginEnd = right;
        if(top!=null) state.config.marginTop = top;
        if(bottom!=null) state.config.marginBottom = bottom;

        state.render();

        return graphHandler;
    }

    function getMargin() : Margin_Type{
        return {
            left : state.config.marginStart,
            right : state.config.marginEnd,
            top : state.config.marginTop,
            bottom : state.config.marginBottom
        }     
    }

//---------------------------------------------------------
//------------------ Relative poition ---------------------

    function relativePosition({x, y}:Relative_Position) : Graph2D_Type{
        if(x===state.config.relativePositionX && y===state.config.relativePositionY) return graphHandler;
        if(x==null && y==null) return graphHandler;

        const svgWidth = state.svg.clientWidth;
        const svgHeight = state.svg.clientHeight;
        if(x!=null) state.config.relativePositionX = x;
        if(y!=null) state.config.relativePositionY = y;
        const newPositionX = svgWidth * state.config.relativePositionX;
        const newPositionY = svgHeight * state.config.relativePositionY;

        state.canvas
            .style("transform", `translate(${newPositionX}px,${newPositionY}px)`)

        return graphHandler;
    }

    function getRelativePosition() : Relative_Position{
        return {
            x : state.config.relativePositionX,
            y : state.config.relativePositionY
        }
    }

//---------------------------------------------------------


    return {
        canvas,
        size,
        getSize,
        relativeSize,
        getRelativeSize,
        center,
        getCenter,
        margin,
        getMargin,
        relativePosition,
        getRelativePosition
    };
}

export default Config;