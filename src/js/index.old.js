/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

const video = document.getElementById('inputVideo');
const canvas = document.getElementById('overlay');

let classifier;
//let video;
let resultsP;

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
	
	
	
	
	navigator.mediaDevices.getUserMedia({
		'audio': true,
		'video': {
			facingMode: 'environment' //user environment
		}
	}).then(function(mediaStream) {
	  // do something with the media stream
	  var mediaControl = document.querySelector('video');
		mediaControl.srcObject = mediaStream;
	  
	});
}



// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using MobileNet and p5.js
This example uses a callback pattern to create the classifier
=== */



function setup() {
  noCanvas();
  // Create a camera input
 // video = createCapture(VIDEO);
  // Initialize the Image Classifier method with MobileNet and the video as the second argument
  //MODEL_URL =   window.cordova.file.applicationDirectory + "www/model/model.json";
  model_url = 'http://192.168.254.104/rice_recognition/model/model.json';
  //classifier = ml5.imageClassifier(model_url, video, modelReady);
  resultsP = createP('Loading model and video...');
  
  yolo_url = "http://192.168.254.104/ml5-data-and-models-server-source/models/yolo/model.json";
  const objectDetector = ml5.objectDetector(yolo_url, {}, modelLoaded);
  
  // Detect objects in the video element
	objectDetector.detect(video, (err, results) => {
	  console.log(results); // Will output bounding boxes of detected objects
	  resultsP.html(results[0].label + ' ' + nf(results[0].confidence, 0, 2));
	});
}

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
}



function modelReady() {
  console.log('Model Ready');
  classifyVideo();
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(gotResult);
}

// When we get a result
function gotResult(err, results) {
  // The results are in an array ordered by confidence.
  console.log(results)
  resultsP.html(results[0].label + ' ' + nf(results[0].confidence, 0, 2));
  classifyVideo();
}

