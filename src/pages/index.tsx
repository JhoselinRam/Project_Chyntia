import { ChangeEvent, useRef, useState } from "react";
import Graph2D, {Graph2DRef, Graph2D_AxisPosition} from "../components/Graph2D/Graph2D";

export default function Home() {
  const graph = useRef<Graph2DRef | null>(null);
  const [background, setBackground] = useState("#ffffff");
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [axisPosition, setAxisPosition] = useState<Graph2D_AxisPosition>("center");

  function setColor(e:ChangeEvent){
    const color = (e.target as HTMLInputElement).value;
    setBackground(color);
  }

  function moveCenterX(e:ChangeEvent){
    const x = (e.target as HTMLInputElement).value;
    setCenterX(parseFloat(x));
  }

  function moveCenterY(e:ChangeEvent){
    const y = (e.target as HTMLInputElement).value;
    setCenterY(parseFloat(y));
  }

  function domainWidth(e : ChangeEvent){
    const newWidth = (e.target as HTMLInputElement).value;
    setWidth(parseFloat(newWidth));
  }

  function domainHeight(e : ChangeEvent){
    const newHeight = (e.target as HTMLInputElement).value;
    setHeight(parseFloat(newHeight));
  }

  function changePosition(e : ChangeEvent){
    const newPosition = ((e.target as HTMLSelectElement).value) as Graph2D_AxisPosition;
    setAxisPosition(newPosition);
  }
  
  return (
    <>
      <div className="flex flex-row, items-center justify-around py-2 gap-2">
        
        <div className="flex flex-col items-center justify-center">
          <p>Color:</p>
          <input type="color"  defaultValue="#ffffff" onChange={setColor}/>
        </div>
       
        <div className="flex flex-col items-start justify-start">
          <p>Center</p>
          <div className="flex flex-row">
            <p>X: </p>
            <input type="number" step={0.02} defaultValue={0} className="border border-gray-500 rounded-md px-1" onChange={moveCenterX}/>
          </div>
          <div className="flex flex-row">
            <p>Y: </p>
            <input type="number" step={0.02} defaultValue={0} className="border border-gray-500 rounded-md px-1" onChange={moveCenterY}/>
          </div>
        </div>
        
        <div className="flex flex-col items-start justify-start">
          <p>Size</p>
          <div className="flex flex-row">
            <p>X: </p>
            <input type="number" step={0.2} min={0.2} defaultValue={10} className="border border-gray-500 rounded-md px-1" onChange={domainWidth} />
          </div>
          <div className="flex flex-row">
            <p>Y: </p>
            <input type="number" step={0.2} min={0.2} defaultValue={10} className="border border-gray-500 rounded-md px-1" onChange={domainHeight}/>
          </div>
        </div>

        <div className="flex flex-col items-start justify-start">
          <p>Position</p>
          <select value={axisPosition} onChange={changePosition}>
            <option value="center">Center</option>
            <option value="bottom-left">Bottom-Left</option>
            <option value="bottom-right">Bottom-Right</option>
            <option value="top-left">Top-Left</option>
            <option value="top-right">Top-Right</option>
          </select>
        </div>

      </div>
      
      
      
      
      <div className="w-full h-[500px] p-10 bg-gray-500 flex items-center justify-center">
        <Graph2D backgroundColor={background} centerX={centerX} centerY={centerY} width={width} height={height} axisPosition={axisPosition}></Graph2D>
      </div>
    </>
    );
  }
 