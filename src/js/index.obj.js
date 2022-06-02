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
	
	make();
}


let objectDetector;
let status;
let objects = [];
let ctx;
const width = 640;
const height = 480;

async function make() {
  // get the video
  

  
  model_url = 'http://192.168.254.104/rice_recognition/model/model.json';
  yolo_url = "http://192.168.254.104/ml5-data-and-models-server-source/models/yolo/model.json";
  objectDetector = await ml5.objectDetector(model_url, startDetecting)
  //canvas = createCanvas(width, height);
  
  canvas.width  = 480;
  canvas.height = 640;
  
  ctx = canvas.getContext('2d');
}



function startDetecting(){
  console.log('model ready')
  detect();
}

function detect() {
  objectDetector.detect(video, function(err, results) {
    if(err){
      console.log(err);
      return
    }
    objects = results;

    if(objects){
      draw();
    }
    
    detect();
  });
}

function draw(){
  // Clear part of the canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0,0, width, height);

  ctx.drawImage(video, 0, 0);
  for (let i = 0; i < objects.length; i += 1) {
      
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(objects[i].label, objects[i].x + 4, objects[i].y + 16); 

    ctx.beginPath();
    ctx.rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
  }
}

// Helper Functions
async function getVideo(){
  // Grab elements, create settings, etc.
  //const video = document.createElement('video');
  video.setAttribute("style", "display: none;"); 
  video.width = width;
  video.height = height;
  document.body.appendChild(video);

  // Create a webcam capture
  const capture = await navigator.mediaDevices.getUserMedia({ video: true })
  video.srcObject = capture;
  video.play();
  
  
  
  

  return video
}

function createCanvas(w, h){
  //const canvas = document.createElement("canvas"); 
  canvas.width  = w;
  canvas.height = h;
  document.body.appendChild(canvas);
  return canvas;
}