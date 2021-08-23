import React, { useEffect, useState, useRef, createRef } from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import CanvasDraw from 'react-canvas-draw';
import { useScreenshot } from 'use-react-screenshot';

function App() {
	//const model = await tf.loadLayersModel('https://localhost:3000/
	const [answer, setAnswer] = useState();
	const [load, setLoad] = useState(false);
	const [model, setModel] = useState();
	const [image, takeScreenshot] = useScreenshot();

	const canvas = useRef();
	const ref = createRef(null);

	// Store the model in state
	useEffect(() => {
		async function getModel() {
			const loadedModel = await tf.loadLayersModel('http://localhost:8080/')
			setModel(loadedModel)
		}
		getModel()
	}, [] )

	function screenshot() {
		console.log('Taking Screenshot...')
		// set loading status for canvas
		takeScreenshot(ref.current)
		setAnswer(null)
		return
	}

	async function predict() {
		setLoad(true)
		let img
		// Stolen from https://stackoverflow.com/questions/61758368/convert-base64-image-to-tensor
		await loadImage(image)
			.then(data => {
				img = data
				return img
			})
			.catch(err => {console.log('ERROR;line55'); return})
		let tensor = tf.browser.fromPixels(img, 1)
		// console.log(tensor)
		tensor = await tf.image.resizeBilinear(tensor, [28,28])
		tensor = tf.reshape(tensor, [1,28,28,1])
		tensor = tf.cast(tensor, 'float32')
		tensor = tf.div(tensor, 255.0)
		// console.log(tensor)
		// tensor.print()
		const pred = await modelPrediction(tensor)
		setAnswer(tf.argMax(pred,-1).toString())
		// console.log(pred)
		// pred.print()
		// console.log('Prediction: ' + (tf.argMax(pred,-1)).toString())
		// console.log(pred.print())
		setLoad(false)
	}

	function loadImage(src) {
		return new Promise((resolve, reject) => {
			const im = new Image()
			im.crossOrigin='anonymous'
			im.src = src
			im.onload = () => {resolve(im)}
		})
	}

	function modelPrediction(arr) {
		return model.predict(arr)
	}

  return (
    <div className="App">
			<h1 className="Title">Testing</h1>
		{/* <div className="Canvas" /> */}
			<div className='Canvas'>
				<div className='CanvasBox'>
					<div ref={ref}>
						<CanvasDraw 
							style={{'backgroundColor':'#000'}}
							ref={canvas} 
							disabled={load ? true : false} 
							hideGrid={true}
							hideInterface={true}
							brushColor='#FFF'
						/>
					</div>
				</div>
				<div className='CanvasButtons'>
					<button onClick={() => canvas.current.clear()}>
						Clear
					</button>
					<button className='SaveImage' onClick={screenshot}>Save Image</button>
				</div>
			</div>
			<div className='Prediction'>
				<h4 className="PredictionTitle">Prediction:</h4>
				<h3 className="PredictionValue">{answer}</h3>
			</div>
			<img src={image} alt={'Screenshot'} className='Screenshot' />
			{	image && 
				<button onClick={predict}>
					Predict
				</button>
			}
    </div>
  );
}

export default App;
