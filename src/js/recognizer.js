


const video = document.getElementById('inputVideo');
const canvas = document.getElementById('overlay');
const canvas2 = document.getElementById('overlay2');

const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');

const width = 600;
const height = 450;

document.addEventListener('deviceready', onDeviceReady, false);


function onDeviceReady() {
	getVideo();
	
	
	
	
	tracking.ColorTracker.registerColor('green', function(r, g, b) {
        var dx = r - 96;
        var dy = g - 139;
        var dz = b - 92;

        if ((b - g) >= 100 && (r - g) >= 120) {
          return true;
        }
        return dx * dx + dy * dy + dz * dz < 3500;
      });
	  
	tracking.ColorTracker.registerColor('brown', function(r, g, b) {
        var dx = r - 165;
        var dy = g - 42;
        var dz = b - 42;

        if ((b - g) >= 100 && (r - g) >= 60) {
          return true;
        }
        return dx * dx + dy * dy + dz * dz < 3500;
      });


        var tracker = new tracking.ColorTracker(['green', 'yellow','brown']);
		tracker.setMinDimension(90);
		tracker.setMinGroupSize(1);

      tracking.track('#inputVideo', tracker, { camera: false });

      tracker.on('track', function(event) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		ctx2.clearRect(0, 0, canvas.width, canvas.height);
		
		ctx.drawImage(video, 0, 0,canvas.width, canvas.height);
        event.data.forEach(function(rect) {
          if (rect.color === 'custom') {
            rect.color = tracker.customColor;
          }

          ctx.strokeStyle = rect.color;
          ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
          ctx.font = '11px Helvetica';
          ctx.fillStyle = "#fff";
          ctx.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
          ctx.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
		  
		  
			canvas2.width  = rect.width;
			canvas2.height = rect.height;
		  
		  
			ctx2.drawImage(video,
			rect.x , rect.y,   // Start at 10 pixels from the left and the top of the image (crop),
			rect.x+ rect.width , rect.y+rect.height  ,   // "Get" a `80 * 30` (w * h) area from the source image (crop),
			0, 0,     // Place the result at 0, 0 in the canvas,
			rect.width+25, rect.height+25); // With as width / height: 160 * 60 (scale)
        });
      });
}







async function getVideo(){
 

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
}