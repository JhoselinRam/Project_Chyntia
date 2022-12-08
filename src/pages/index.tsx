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
  const [marginStart, setMarginStart] = useState(5);
  const [marginTop, setMarginTop] = useState(5);
  const [marginEnd, setMarginEnd] = useState(5);
  const [marginBottom, setMarginBottom] = useState(5);
  const graphRef = useRef<HTMLDivElement | null>(null);
  const posX = useRef(0);
  const posY = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);

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

  function changeMarginStart(e:ChangeEvent){
    const newMargin = parseFloat((e.target as HTMLInputElement).value);
    setMarginStart(newMargin);
  }

  function changeMarginTop(e:ChangeEvent){
    const newMargin = parseFloat((e.target as HTMLInputElement).value);
    setMarginTop(newMargin);
  }

  function changeMarginEnd(e:ChangeEvent){
    const newMargin = parseFloat((e.target as HTMLInputElement).value);
    setMarginEnd(newMargin);
  }

  function changeMarginBottom(e:ChangeEvent){
    const newMargin = parseFloat((e.target as HTMLInputElement).value);
    setMarginBottom(newMargin);
  }

  function setPointerListeners(element:HTMLDivElement){
    if(element == null) return;

    graphRef.current = element;
    element.addEventListener("pointerdown", pointerDown);
    element.addEventListener("pointerup", pointerUp);

  }
  
  function pointerDown(e:PointerEventInit){
    posX.current = e.clientX as number;
    posY.current = e.clientY as number;
    lastX.current = centerX;
    lastY.current = centerY;

    graphRef.current?.addEventListener("pointermove", pointerMove);
  }

  function pointerMove(e : PointerEventInit){
    const displacementX = ((e.clientX as number) - posX.current)/70;
    const displacementY = (posY.current -(e.clientY as number))/50;
    
    setCenterX(lastX.current + displacementX);
    setCenterY(lastY.current + displacementY);
    

  }

  function pointerUp(e : PointerEventInit){
    graphRef.current?.removeEventListener("pointermove", pointerMove);
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
            <input type="number" step={0.02} value={centerX.toFixed(2)} className="border border-gray-500 rounded-md px-1" onChange={moveCenterX}/>
          </div>
          <div className="flex flex-row">
            <p>Y: </p>
            <input type="number" step={0.02} value={centerY.toFixed(2)} className="border border-gray-500 rounded-md px-1" onChange={moveCenterY}/>
          </div>
        </div>
        
        <div className="flex flex-col items-start justify-start">
          <p>Size</p>
          <div className="flex flex-row">
            <p>X: </p>
            <input type="number" step={0.2} min={0.2} value={width} className="border border-gray-500 rounded-md px-1" onChange={domainWidth} />
          </div>
          <div className="flex flex-row">
            <p>Y: </p>
            <input type="number" step={0.2} min={0.2} value={height} className="border border-gray-500 rounded-md px-1" onChange={domainHeight}/>
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

        <div className="flex flex-col items-start justify-start">
          <p>Margin</p>
          <div className="flex items-start justify-start">
            <div className="flex gap-2">
            <p>Start</p>
            <input type="number" value={marginStart} className="border border-gray-500 rounded-md px-1" onChange={changeMarginStart}/>
            </div>
            <div className="flex gap-2">
            <p>End</p>
            <input type="number" value={marginEnd} className="border border-gray-500 rounded-md px-1" onChange={changeMarginEnd}/>
            </div>
          </div>
          <div className="flex items-start justify-start">
            <div className="flex gap-2">
            <p>Top</p>
            <input type="number" value={marginTop} className="border border-gray-500 rounded-md px-1" onChange={changeMarginTop}/>
            </div>
            <div className="flex gap-2">
            <p>Bottom</p>
            <input type="number" value={marginBottom} className="border border-gray-500 rounded-md px-1" onChange={changeMarginBottom}/>
            </div>
          </div>
        </div>

      </div>
      
      
      
      
      <div className="w-full h-[500px] p-10 bg-gray-500 flex items-center justify-center" ref={setPointerListeners}>
        <Graph2D backgroundColor={background} 
                 centerX={centerX} 
                 centerY={centerY} 
                 width={width} 
                 height={height} 
                 axisPosition={axisPosition} 
                 marginStart={marginStart}
                 marginTop={marginTop}
                 marginEnd={marginEnd}
                 marginBottom={marginBottom}></Graph2D>
      </div>
    </>
    );
  }
 