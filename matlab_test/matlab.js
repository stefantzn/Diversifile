const { exec } = require('child_process');

console.log("Starting")

const scriptPath = 'diversifile.m';

// // Start the MATLAB script execution
// const child = exec(`/Applications/MATLAB_R2024a.app/bin/matlab -nodisplay -nosplash -r "run('${scriptPath}'); exit;"`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error executing MATLAB script: ${error.message}`);
//       return; // Removed res.status(500).send('Error running MATLAB script') to focus on the child process handling
//     }
//     console.log(`MATLAB stdout: ${stdout}`);
//     // console.error(`MATLAB stderr: ${stderr}`);
//     // Assuming res.sendFile(outputImage) is part of a larger application logic not shown here
//     clearTimeout(killTimeout); 
// });


// var company = "IBM";

// const child = exec(`/Applications/MATLAB_R2024a.app/bin/matlab -nodisplay -nosplash -r "diversifile('${company}'); exit;"`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error executing MATLAB script: ${error.message}`);
//       return; // Removed res.status(500).send('Error running MATLAB script') to focus on the child process handling
//     }
//     console.log(`MATLAB stdout: ${stdout}`);
//     // console.error(`MATLAB stderr: ${stderr}`);
//     // Assuming res.sendFile(outputImage) is part of a larger application logic not shown here
//     clearTimeout(killTimeout); 
// });

const child = exec(`/Applications/MATLAB_R2024a.app/bin/matlab -nodisplay -nosplash -r "run('Candlestick_Analysis.m'); exit;"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing MATLAB script: ${error.message}`);
      return; // Removed res.status(500).send('Error running MATLAB script') to focus on the child process handling
    }
    console.log(`MATLAB stdout: ${stdout}`);
    // console.error(`MATLAB stderr: ${stderr}`);
    // Assuming res.sendFile(outputImage) is part of a larger application logic not shown here
    clearTimeout(killTimeout); 
});

// Set a timeout to kill the process if it runs longer than 5 seconds
const killTimeout = setTimeout(() => {
    if (!child.killed) {
        console.log('MATLAB script did not finish in time. Killing the process.');
        child.kill(); // This sends SIGTERM signal
    }
}, 15000); // Adjust