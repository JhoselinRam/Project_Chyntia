import { ChangeEvent, ReactNode, useRef } from "react";
import Graph2D, { Graph2D_Type, Graph2D_AxisPosition } from "../resourses/Graph2D/Graph2D";

export default function Home() {
  let Graph : Graph2D_Type; 
  const colorTarget = useRef("0");
  const opacityTarget = useRef("0");

  function changeColor(e:ChangeEvent){
    const color = (e.target as HTMLInputElement).value as string;
    Graph.backgroundColor(color);
  }

  function changeOpacity(e : ChangeEvent){
    const opacity = parseFloat((e.target as HTMLInputElement).value as string);
    Graph.backgroundOpacity(opacity);
  }

  function changePosition(e : ChangeEvent){
    const position = (e.target as HTMLSelectElement).value as Graph2D_AxisPosition;
    Graph.axisPosition(position);
  }

  function changeColorTarget(e:ChangeEvent){
    colorTarget.current = (e.target as HTMLSelectElement).value;
  }

  function changeAxisColor(e:ChangeEvent){
    const color = (e.target as HTMLInputElement).value;

    switch(colorTarget.current){
      case "0":
        Graph.axisColor({axis:color});
        break;
      case "1":
        Graph.axisColor({xAxis:color});
        break;
      case "2":
        Graph.axisColor({yAxis:color});
        break;
      case "3":
        Graph.axisColor({xBase:color});
        break;
      case "4":
        Graph.axisColor({xTick:color});
        break;
      case "5":
        Graph.axisColor({xLabel:color});
        break;
      case "6":
        Graph.axisColor({yBase:color});
        break;
      case "7":
        Graph.axisColor({yTick:color});
        break;
      case "8":
        Graph.axisColor({yLabel:color});
        break;
    }

  }
  
  function changeOpacityTarget(e:ChangeEvent){
    opacityTarget.current = (e.target as HTMLSelectElement).value;
  }
  
  function changeAxisOpacity(e:ChangeEvent){
    const opacity = parseFloat((e.target as HTMLInputElement).value);

    switch(opacityTarget.current){
      case "0":
        Graph.axisOpacity({axis:opacity});
        break;
      case "1":
        Graph.axisOpacity({xAxis:opacity});
        break;
      case "2":
        Graph.axisOpacity({yAxis:opacity});
        break;
      case "3":
        Graph.axisOpacity({xBase:opacity});
        break;
      case "4":
        Graph.axisOpacity({xTick:opacity});
        break;
      case "5":
        Graph.axisOpacity({xLabel:opacity});
        break;
      case "6":
        Graph.axisOpacity({yBase:opacity});
        break;
      case "7":
        Graph.axisOpacity({yTick:opacity});
        break;
      case "8":
        Graph.axisOpacity({yLabel:opacity});
        break;
    }
  }

  function changeWidth(e:ChangeEvent){
    const width = parseFloat((e.target as HTMLInputElement).value);
    Graph.size({width});
  }
  
  function changeHeight(e:ChangeEvent){
    const height = parseFloat((e.target as HTMLInputElement).value);
    Graph.size({height});
  }

  function changeRelativeWidth(e:ChangeEvent){
    const relativeWidth = parseFloat((e.target as HTMLInputElement).value);
    Graph.relativeSize({width:relativeWidth});
  }
  
  function changeRelativeHeight(e:ChangeEvent){
    const relativeHeight = parseFloat((e.target as HTMLInputElement).value);
    Graph.relativeSize({height:relativeHeight});
  }

  function changeCenterX(e:ChangeEvent){
    const position = parseFloat((e.target as HTMLInputElement).value);
console.time();
    Graph.center({x:position});
console.timeEnd();
  }
  
  function changeCenterY(e:ChangeEvent){
    const position = parseFloat((e.target as HTMLInputElement).value);
    Graph.center({y:position});
  }

  function changeMarginLeft(e:ChangeEvent){
    const margin = parseFloat((e.target as HTMLInputElement).value);
    Graph.margin({left:margin});
  }
  
  function changeMarginRight(e:ChangeEvent){
    const margin = parseFloat((e.target as HTMLInputElement).value);
    Graph.margin({right:margin});
  }
  
  function changeMarginTop(e:ChangeEvent){
    const margin = parseFloat((e.target as HTMLInputElement).value);
    Graph.margin({top:margin});
  }
  
  function changeMarginBottom(e:ChangeEvent){
    const margin = parseFloat((e.target as HTMLInputElement).value);
    Graph.margin({bottom:margin});
  }

  function changeRelativePositionX(e:ChangeEvent){
    const position = parseFloat((e.target as HTMLInputElement).value);
    Graph.relativePosition({x:position});
  }
  
  function changeRelativePositionY(e:ChangeEvent){
    const position = parseFloat((e.target as HTMLInputElement).value);
    Graph.relativePosition({y:position});
  }

  function changeContainedX(e:ChangeEvent){
    const value = Graph.getAxisDynamic();
    Graph.axisDynamic({xContained:!value.xContained});
  }

  function changeDynamicX(e:ChangeEvent){
    const value = Graph.getAxisDynamic();
    Graph.axisDynamic({xDynamic:!value.xDynamic});
  }
  
  function changeContainedY(e:ChangeEvent){
    const value = Graph.getAxisDynamic();
    Graph.axisDynamic({yContained:!value.yContained});
  }

  function changeDynamicY(e:ChangeEvent){
    const value = Graph.getAxisDynamic();
    Graph.axisDynamic({yDynamic:!value.yDynamic});
  }
























  function setGraphObject(element : SVGSVGElement){
    if(element == null) return;
    Graph = Graph2D(element);

  }

  return (
    <>
    <div className="flex flex-col justify-center items-center px-2">
      
      <div className="flex items-start justify-center gap-5 my-3">
        
        <div className="flex flex-col items-start justify-center">
          <p>Background</p>
          <input type="color" defaultValue="#ffffff" onChange={changeColor} className="w-6 h-6 self-center mt-1"/>
        </div>
        <div className="flex flex-col justify-start items-start">
          <p>Canvas opacity</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[150px]" min={0} max={1} step={0.02} defaultValue={1} onChange={changeOpacity}/>
        </div>
        <div className="flex flex-col justify-start items-start">
          <p>Position</p>
          <select defaultValue="center" className="border border-gray-500 rounded-md w-full px-1" onChange={changePosition}>
            <option value="center">Center</option>
            <option value="bottom-left">Bottom-Left</option>
            <option value="bottom-right">Bottom-Right</option>
            <option value="top-left">Top-Left</option>
            <option value="top-right">Top-Right</option>
          </select>
        </div>
        <div className="flex flex-col justify-start items-start">
          <div className="flex items-center justify-center">
            <p>Color</p>
            <p className="mx-1">to:</p>
            <select defaultValue={0} className="border border-gray-500 rounded-md w-full px-1 min-w-[80px]" onChange={changeColorTarget}>
              <option value="0">All axis</option>
              <option value="1">X Axis</option>
              <option value="2">Y Axis</option>
              <option value="3">X Base</option>
              <option value="4">X Ticks</option>
              <option value="5">X Labels</option>
              <option value="6">Y Base</option>
              <option value="7">Y Ticks</option>
              <option value="8">Y Labels</option>
            </select>
          </div>
          <input type="color" defaultValue="#000000" className="w-6 h-6 self-center mt-1"  onChange={changeAxisColor}/>
        </div>
        <div className="flex flex-col justify-start items-start">
          <div className="flex items-center justify-center">
            <p>Opacity</p>
            <p className="mx-1">to:</p>
            <select defaultValue={0} className="border border-gray-500 rounded-md w-full px-1" onChange={changeOpacityTarget}>
              <option value="0">All axis</option>
              <option value="1">X Axis</option>
              <option value="2">Y Axis</option>
              <option value="3">X Base</option>
              <option value="4">X Ticks</option>
              <option value="5">X Labels</option>
              <option value="6">Y Base</option>
              <option value="7">Y Ticks</option>
              <option value="8">Y Labels</option>
            </select>
          </div>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[175px]" min={0} max={1} step={0.02} defaultValue={1} onChange={changeAxisOpacity}/>
        </div>
        <div className="grid grid-cols-2">
          <p className="place-self-end mr-2">Width</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[120px]" step={0.1} defaultValue={10} onChange={changeWidth}/>
          <p className="place-self-end mr-2">Height</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[120px]" step={0.1} defaultValue={10} onChange={changeHeight}/>
        </div>
        <div className="grid grid-cols-2">
          <p className="place-self-end mr-2">Relative width</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[150px]"  step={0.01} defaultValue={1} onChange={changeRelativeWidth}/>
          <p className="place-self-end mr-2">Relative height</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[150px]" min={0} step={0.01} defaultValue={1} onChange={changeRelativeHeight}/>
        </div>
        <div className="grid grid-cols-2">
          <p className="place-self-end mr-2">Center X</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[120px]" step={0.1} defaultValue={0} onChange={changeCenterX}/>
          <p className="place-self-end mr-2">Center Y</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[120px]" step={0.1} defaultValue={0} onChange={changeCenterY}/>
        </div>
      
      </div>
      <div className="flex items-start justify-center gap-5 my-3">
        
        <div className="grid grid-cols-4">
          <p className="place-self-end mr-2">Margin left</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[120px]" step={1} defaultValue={5} onChange={changeMarginLeft}/>
          <p className="place-self-end mr-2">Margin right</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[120px]" step={1} defaultValue={5} onChange={changeMarginRight}/>
          <p className="place-self-end mr-2">Margin top</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[120px]" step={1} defaultValue={5} onChange={changeMarginTop}/>
          <p className="place-self-end mr-2">Margin bottom</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[120px]" step={1} defaultValue={5} onChange={changeMarginBottom}/>
        </div>
        <div className="grid grid-cols-2">
          <p className="place-self-end mr-2">Relative position x</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[120px]" step={0.01} defaultValue={0} onChange={changeRelativePositionX}/>
          <p className="place-self-end mr-2">Relative position y</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1 max-w-[120px]" step={0.01} defaultValue={0} onChange={changeRelativePositionY}/>
        </div>
        <div className="grid grid-cols-4">
          <p className="place-self-end mr-2">Contained x</p>
          <input type="checkbox" defaultChecked onChange={changeContainedX} className="w-[15px] h-[15px] self-center"/>
          <p className="place-self-end mr-2">Dynamic x</p>
          <input type="checkbox" defaultChecked onChange={changeDynamicX} className="w-[15px] h-[15px] self-center"/>
          <p className="place-self-end mr-2">Contained y</p>
          <input type="checkbox" defaultChecked onChange={changeContainedY} className="w-[15px] h-[15px] self-center"/>
          <p className="place-self-end mr-2">Dynamic y</p>
          <input type="checkbox" defaultChecked onChange={changeDynamicY} className="w-[15px] h-[15px] self-center  "/>
        </div>
      
      </div>
    
    </div>

    <div className="w-full h-[500px] p-10 bg-gray-500 flex items-center justify-center">
        <svg className="w-full h-full" ref={setGraphObject}>
        </svg>
    </div>



    </>
    );
  }
 