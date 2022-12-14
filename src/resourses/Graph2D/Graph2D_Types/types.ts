import { ScaleLinear, ScaleLogarithmic, Selection } from "d3"
import { Axis_Color_Options, Axis_Opacity_Options, Graph2D_Type, Graph2D_AxisPosition, Graph2D_AxisType, Canvas_Size, Center_Type, Margin_Type, Relative_Position, Graph2D_LineStyle, Axis_Dynamic, Axis_Overlap, Axis_Units, Grid_Enabled, Grid_Color, Grid_Opacity, Grid_Style, Grid_Spacing, PointerMove_Options } from "../Graph2D"

//------------------------- Main ---------------------------

export type Graph2D_State = {
    render ?: ()=>void,
    fullRender ?: ()=>void,
    svg : SVGSVGElement,
    graphID : string,
    canvas : Selection<SVGGElement, unknown, null, undefined>,
    lineStyleMap : Line_Style_Map,
    background : {
        bgColor : string,
        bgOpacity : number
    },
    scale ?: {
        inner : Scale,
        reference : Scale,
        compute : ()=>void
    },
    axis :{
        type : Graph2D_AxisType,
        position : Graph2D_AxisPosition,
        xAxisContained : boolean,
        yAxisContained : boolean,
        xLabelDynamic : boolean,
        yLabelDynamic : boolean,
        xUnit : string | null,
        yUnit : string | null,
        xAxisColor : string,
        xAxisOpacity : number,
        yAxisColor : string,
        yAxisOpacity : number,
        xTickColor : string,
        xTickOpacity : number,
        xLabelColor : string,
        xLabelOpacity : number,
        yTickColor : string,
        yTickOpacity : number,
        yLabelColor : string,
        yLabelOpacity : number,
        xAxisOverlap : boolean,
        yAxisOverlap : boolean,
        overlapPriority : "X" | "Y",
        compute ?: ()=>void,
    },
    grid : {
        main : {
            compute ?: ()=>void,
            xEnabled : boolean,
            xColor : string,
            xOpacity : number,
            xStyle : Graph2D_LineStyle,
            yEnabled : boolean,
            yColor : string,
            yOpacity : number,
            yStyle : Graph2D_LineStyle
        },
        aux : {
            compute ?: ()=>void,
            xEnabled : boolean,
            xColor : string,
            xOpacity : number,
            xStyle : Graph2D_LineStyle,
            xSpacing : number | "auto"
            yEnabled : boolean,
            yColor : string,
            yOpacity : number,
            yStyle : Graph2D_LineStyle,
            ySpacing : number | "auto"
        }
    },
    config : {
        width : number,
        height : number,
        relativeWidth : number,
        relativeHeight : number,
        relativePositionX : number,
        relativePositionY : number,
        centerX : number,
        centerY : number,
        marginStart : number,
        marginTop : number,
        marginEnd : number,
        marginBottom : number
    },
    events : {
        pointerMove : {
            pointerCapture : boolean,
            delay : number,
            x : number,
            y : number,
            cursorHover : string,
            cursorMove : string,
            callback ?: (arg0?:Graph2D_Type)=>void
        }
    }
}

export type Method_Generator_Props = {
    graphHandler : Graph2D_Type, 
    state : Graph2D_State
}

export type Line_Style_Map = {
    solid : string,
    dashed: string, 
    doted : string,
    "dash-dot": string, 
    "dash-2dot": string
}

//---------------------------------------------------------
//---------------------- Background -----------------------

export type Background_Type = {
    backgroundColor : (arg0:string)=>Graph2D_Type,
    getBackgroundColor : ()=>string,
    backgroundOpacity : (arg0:number)=>Graph2D_Type,
    getBackgroundOpacity : ()=>number
}

//---------------------------------------------------------
//------------------------- Scale -------------------------

export type Scale = {
    x : ScaleLinear<number, number, never> | ScaleLogarithmic<number, number, never>,
    y : ScaleLinear<number, number, never> | ScaleLogarithmic<number, number, never>
}

export type Scale_Type = {
    inner : Scale,
    reference : Scale,
    compute : ()=>void   
}

export type GetScale_Type = {
    rangeStartX : number,
    rangeEndX : number,
    rangeStartY : number,
    rangeEndY : number
}

//---------------------------------------------------------
//-------------------------- Axis -------------------------

export type Axis_Type = {
    compute : ()=>void,
    axisType : (arg0:Graph2D_AxisType)=>Graph2D_Type,
    getAxisType : ()=>Graph2D_AxisType,
    axisPosition : (arg0:Graph2D_AxisPosition)=>Graph2D_Type,
    getAxisPosition : ()=>Graph2D_AxisPosition,
    axisColor : (arg0:Axis_Color_Options)=>Graph2D_Type,
    getAxisColor :  ()=>Axis_Color_Options,
    axisOpacity : (arg0:Axis_Opacity_Options)=>Graph2D_Type,
    getAxisOpacity : ()=>Axis_Opacity_Options,
    axisOverlap : (arg0:Axis_Overlap)=>Graph2D_Type,
    getAxisOverlap : ()=>Axis_Overlap,
    axisDynamic : (arg0:Axis_Dynamic)=>Graph2D_Type,
    getAxisDynamic : ()=>Axis_Dynamic,
    axisUnits : (arg0:Axis_Units)=>Graph2D_Type,
    getAxisUnits : ()=>Axis_Units
}

export type Compute_Background_Props = {
    tick : SVGGElement,
    labelTranslationX : number,
    labelTranslationY : number
}

export type Define_Mask_Props = {
    tick : SVGGElement, 
    initCoords:Array<string>,
    mask : string
}

export type Compute_Mask_Props = {
    tick : SVGGElement,
    translationX : number,
    translationY : number,
    labelTranslationX : number,
    labelTranslationY : number,
    axis : "x" | "y",
    label : string
}

export type Set_Proxi_Props = {
    tick : SVGGElement,
    axis : "x" | "y",
    label : string,
    absolutePositionX : number,
    absolutePositionY : number,
    labelSize : DOMRect
}

//---------------------------------------------------------
//------------------------ Config -------------------------

export type Config_Type = {
    canvas : ()=>SVGGElement,
    size : (arg0:Canvas_Size)=>Graph2D_Type,
    getSize : ()=>Canvas_Size,
    relativeSize : (arg0:Canvas_Size)=>Graph2D_Type,
    getRelativeSize : ()=>Canvas_Size,
    center :  (arg0:Center_Type)=>Graph2D_Type,
    getCenter : ()=>Center_Type,
    margin : (arg0:Margin_Type)=>Graph2D_Type,
    getMargin : ()=>Margin_Type,
    relativePosition : (arg0:Relative_Position)=>Graph2D_Type,
    getRelativePosition : ()=>Relative_Position
}

//---------------------------------------------------------
//------------------------- Grid --------------------------

export type Grid_Type = {
    mainGrid : Main_Grid,
    auxGrid : Aux_Grid
}

export type Grid_Method_Generator = {
    state : Graph2D_State,
    graphHandler : Graph2D_Type,
    getMinMaxCoords : ()=>MinMaxCoords_Type
}

export type Main_Grid = {
    compute : ()=>void,
    mainGridEnabled : (arg0:Grid_Enabled)=>Graph2D_Type,
    getMainGridEnabled : ()=>Grid_Enabled,
    mainGridColor : (arg0:Grid_Color)=>Graph2D_Type,
    getMainGridColor : ()=>Grid_Color,
    mainGridOpacity : (arg0:Grid_Opacity)=>Graph2D_Type,
    getMainGridOpacity : ()=>Grid_Opacity,
    mainGridStyle : (arg0:Grid_Style)=>Graph2D_Type,
    getMainGridStyle : ()=>Grid_Style
}

export type Aux_Grid = {
    compute : ()=>void,
    auxGridEnabled : (arg0:Grid_Enabled)=>Graph2D_Type,
    getAuxGridEnabled : ()=>Grid_Enabled,
    auxGridColor : (arg0:Grid_Color)=>Graph2D_Type,
    getAuxGridColor : ()=>Grid_Color,
    auxGridOpacity : (arg0:Grid_Opacity)=>Graph2D_Type,
    getAuxGridOpacity : ()=>Grid_Opacity,
    auxGridStyle : (arg0:Grid_Style)=>Graph2D_Type,
    getAuxGridStyle : ()=>Grid_Style,
    auxGridSpacing : (arg0:Grid_Spacing)=>Graph2D_Type,
    getAuxGridSpacing : ()=>Grid_Spacing
}

export type Main_Lines_Props = {
    axis : "X" | "Y",
    color : string,
    opacity : number,
    style : Graph2D_LineStyle
}

export type Aux_Lines_Props = {
    axis : "X" | "Y",
    color : string,
    opacity : number,
    style : Graph2D_LineStyle,
    spacing : "auto" | number
}

export type Spacing_Info_Props = {
    axis : "X" | "Y",
    spacing : "auto" | number
}

export type Spacing_Info_Type = {
    ticks : Array<number>,
    amount : number
}

export type MinMaxCoords_Type = {
    xMin : number,
    xMax : number,
    yMin : number,
    yMax : number
}

//---------------------------------------------------------
//---------------------- Events ---------------------------

export type Events_Type = {
    enablePointerMove : (arg?:boolean, arg1?:PointerMove_Options)=>void
}

export type Compute_PointerMove = {
    coordX : number,
    coordY : number,
}

//---------------------------------------------------------