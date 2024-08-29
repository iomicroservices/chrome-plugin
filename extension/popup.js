// Import Twilio Voice SDK
import { Device } from 'twilio-voice';

let device;
let token;

// Function to initialize the Twilio Device
async function setupDevice() {
  try {
    // Fetch token from your server
    const response = await fetch('http://localhost:3000/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identity: 'user' }),
    });
    const data = await response.json();
    token = data.token;
    
    device = new Device(token, {
      codecPreferences: ['opus', 'pcmu'],
      fakeLocalDTMF: true,
      warnings: true,
      enableRingingState: true,
    });

    device.on('ready', function() {
      console.log('Twilio.Device Ready!');
    });

    device.on('error', function(error) {
      console.log('Twilio.Device Error: ' + error.message);
    });

    device.on('connect', function(conn) {
      console.log('Successfully established call!');
    });

    device.on('disconnect', function(conn) {
      console.log('Call ended.');
    });

    await device.register();
  } catch (err) {
    console.error('An error occurred while setting up the device', err);
  }
}


// Function to make a call
function makeCall() {
  const params = {
      To: document.getElementById('phone-number').value
  };

  device.connect(params);
}

// Function to end the call
function hangUp() {
  device.disconnectAll();
}

// Event listeners
document.getElementById('call-button').addEventListener('click', makeCall);
document.getElementById('hangup-button').addEventListener('click', hangUp);

// Initialize the device when the popup is opened
setupDevice();

// ... rest of your popup.js code ...