import { select } from "d3";
import { useEffect, useRef } from "react";
import { Graph2DInterface, Scale } from "../Graph2D_types/types";
import setupAxis from "./tools/setupAxis";
import setupBackground from "./tools/setupBackground";
import setupScale from "./tools/setupScale";

function useCanvas({width=10, height=10, centerX=0, centerY=0, backgroundColor="#ffffff", axisType="rectangular", axisPosition="center", marginStart=5, marginTop=5, marginEnd=5, marginBottom=5} : Graph2DInterface){
    const svg = useRef<SVGSVGElement | null>(null);
    const {setBackground, setAxisBackground} = setupBackground({svg, backgroundColor});
    const {setScale} = setupScale({svg, width, height, centerX, centerY, axisType, axisPosition, marginStart, marginTop, marginEnd, marginBottom});
    const {setAxis} = setupAxis({svg, axisPosition, centerX, centerY, marginStart, marginTop, marginEnd, marginBottom}); 
    let scale : Scale;
    let reference : Scale;

//------------------------------------------------------------------
//------------------------------------------------------------------

    useEffect(()=>{
        init();
        return ()=>{
            cleanSvg();
        }
    });

//------------------------------------------------------------------
//------------------------------------------------------------------
    
    function init(){
        setupSvg();
        setBackground();
        ({scale, reference} = setScale());
        setAxis({scale, reference});
        setAxisBackground();
    }

//------------------------------------------------------------------
//------------------------------------------------------------------

    function setupSvg(){
        if(svg.current == null) return;
        
        const container = select(svg.current)
            .append("g")
            .classed("Graph2D_Container", true);

        container
            .append("g")
            .classed("Graph2D_Data", true);
        
        container
            .append("g")
            .classed("Graph2D_Axis", true);

    }

//------------------------------------------------------------------
//------------------------------------------------------------------

    function cleanSvg(){
        if(svg.current == null) return;

        select(svg.current)
            .select("g.Graph2D_Container")
            .remove();
    }

//------------------------------------------------------------------
//------------------------------------------------------------------
    
    function setSvg(element : SVGSVGElement){
        svg.current = element;
    }

//------------------------------------------------------------------
//------------------------------------------------------------------

    return setSvg;
}

export default useCanvas;