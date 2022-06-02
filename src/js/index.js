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
const canvas1 = document.getElementById('canvas');

const ctx = canvas.getContext('2d');



let classifier;
//let video;
let resultsP;

let yolo;
let status;
let objects = [];

const width = 480;
const height = 360;


function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
	
	//navigator.mediaDevices.getUserMedia({
	//	'audio': false,
	//	'video': {
	//		facingMode: 'environment' //user environment
	//	}
	//}).then(function(mediaStream) {
	//  // do something with the media stream
	//  var mediaControl = document.querySelector('video');
	//	mediaControl.srcObject = mediaStream;
	//  
	//});
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
  //model_url = 'http://192.168.254.104/rice_recognition/model/model.json';
  
  //load the image classifier
  video = await getVideo();
  model_url = window.localStorage.getItem("model_url");
  
  
  //classifier = ml5.imageClassifier(model_url, video, modelReady);
  classifier = ml5.objectDetector(model_url, video, modelReady);
  //resultsP = createP('Loading model and video...');
  $("#results_here").append("Loading Model...");
 
}


function modelReady() {
  console.log('Model Ready');
  classifyVideo();
}

// Get a prediction for the current video frame
function classifyVideo() {
  //classifier.classify(gotResult);
  classifier.detect(gotResult);
}

// When we get a result
function gotResult(err, results) {
  // The results are in an array ordered by confidence.
  //console.log(results)
  objects = results;
  
  if(results){
  
	  $("#results_here").empty();
	  
	  
	  
	  results.forEach(function(item,index){
	  console.log(item);
	  draw();
	  d = nf(item.confidence, 0, 2) * 100;
		tag = '<div class="progress m-2">'+
	  '<div class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style="width: '+d+'%;"aria-valuemin="0" aria-valuemax="100">'+item.label+' : '+d+'%</div>'+
	'</div>';
		
		$("#results_here").append(tag);
	  
	  });
  }else{ console.log("retry")}
  classifyVideo();
}





function draw(){
  // Clear part of the canvas
  ctx.fillStyle = "#000000"
  ctx.fillRect(0,0, width, height);

  ctx.drawImage(video, 0, 0);
  for (let i = 0; i < objects.length; i += 1) {
      
    ctx.font = "16px Arial";
    ctx.fillStyle = "green";
    ctx.fillText(objects[i].label, objects[i].x + 4, objects[i].y + 16); 

    ctx.beginPath();
    ctx.rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.closePath();
  }
}

async function getVideo(){
  // Grab elements, create settings, etc.
  const videoElement = document.createElement('video');
  videoElement.setAttribute("style", "display: none;"); 
  videoElement.width = width;
  videoElement.height = height;
  document.body.appendChild(videoElement);

  // Create a webcam capture
  const capture = await navigator.mediaDevices.getUserMedia({
		'audio': false,
		'video': {
			facingMode: 'environment' //user environment
		}
	}).then(function(mediaStream) {
	  // do something with the media stream
	  var mediaControl = document.querySelector('video');
		mediaControl.srcObject = mediaStream;
	  
	});
  videoElement.srcObject = capture;
  videoElement.play();

  return videoElement
}