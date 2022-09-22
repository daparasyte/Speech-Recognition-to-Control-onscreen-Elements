import React, {useEffect, useState, useRef} from 'react';
import logo from './logo.svg';
import './App.css';

// Importing Dependencies
import * as tf from "@tensorflow/tfjs";
import * as speech from "@tensorflow-models/speech-commands";

// Drawing element
import { drawBall } from './utilities';


const App = () => {
  // Creating Model and Action states
const [model, setModel] = useState(null);
const [action, setAction] = useState(null);
const [labels, setLabels] = useState(null);


// Creating Canvas reference and x,y,r
const canvasRef = useRef(null); 
const [x, setX] = useState(300)
const [y, setY] = useState(300)
const [r, setR] = useState(10)


// Creating Recognizer
const loadModel = async () =>{
  const recognizer = await speech.create("BROWSER_FFT")
  console.log('Model Loaded')
  await recognizer.ensureModelLoaded();
  console.log(recognizer.wordLabels())
  setModel(recognizer)
  setLabels(recognizer.wordLabels())
}

useEffect(()=>{loadModel()}, []);


// Updating element state
const numberMap = {
  "zero":0,
  "one":1,
  "two":2,
  "three":3,
  "four":4,
  "five":5,
  "six":6,
  "seven":7,
  "eight":8,
  "nine":9
}

useEffect(()=>{
  // Update position x,y
  const update = action === 'up' ? setY(y-10) : action==="down" ? setY(y+10) : action==="left" ? setX(x-10) : action==="right"? setX(x+10) : ""
  // Update size r
  if(Object.keys(numberMap).includes(action)){
    setR(10*numberMap[action])
  }

  canvasRef.current.width = 600;
  canvasRef.current.height = 600;
  const ctx = canvasRef.current.getContext('2d')
  console.log(x,y,r)
  drawBall(ctx,x,y,r)
  setAction('base')
}, [action])


// Listening for Actions
function argMax(arr){
  return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

const recognizeCommands = async () =>{
  console.log('Listening for commands')
  model.listen(result=>{
    // console.log(labels[argMax(Object.values(result.scores))])
    setAction(labels[argMax(Object.values(result.scores))])
    
  }, {includeSpectrogram:true, probabilityThreshold:0.7})
  // setTimeout(()=>model.stopListening(), 10e3)
}


  return (
    <div className="App">
      <header className="App-header">
      {/* Setting up Canvas */}
      <canvas 
        ref={canvasRef}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 640,
        }}
        />

        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        <button onClick={recognizeCommands}>Command</button>
        {/* Displaying the command to the screen */}
        {action ? <div>{action}</div>:<div>No Action Detected</div> }
      </header>
    </div>
  );
}

export default App;
