import { forwardRef, memo, Ref, useImperativeHandle } from "react";
import { Graph2DInterface } from "./resourses/Graph2D_types/types";
import useCanvas from "./resourses/hooks/useCanvas";

function Graph2D(props:Graph2DInterface, ref:Ref<Graph2DRef>){
    const setSvgElement = useCanvas(props);

    useImperativeHandle(ref,()=>{
        return {

        };
    });
    
    function svgSetup(element:SVGSVGElement){
        if(element==null) return;
        setSvgElement(element);
    }

   
    return (
        <div className="w-full h-full hover:cursor-move">
            <svg className="w-full h-full select-none" ref={svgSetup}>
            </svg>
        </div>
    );
}





export type Graph2D_AxisType = "rectangular" | "polar" | "x-log" | "y-log" | "log-log";
export type Graph2D_AxisPosition = "center" | "bottom-left" | "bottom-right" | "top-left" | "top-right";

export type Graph2DRef = {

}





export default memo(forwardRef(Graph2D));