var start, end, time;

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete"
        || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {  
    var resultContainer = document.getElementById('qr-reader-results');
    var lastResult, countResults = 0, strPlan;
    var planContainer =document.getElementById('qr-reader-plan');
    var resultDisplay = document.getElementById("qr-title-text");
    var panelTitle = document.getElementById("qr-title");

    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            start = new Date().getTime(); 
            ++countResults;
            lastResult = decodedText; 
            CheckResult();            
            //console.log(`Scan result ${decodedText}`, decodedResult);            
        } else {
            end = new Date().getTime();
            time = end - start;    
        
            if (time > 2000){  
                CheckResult();           
                start = new Date().getTime(); 
            }    
        }       

        function CheckResult(){
            // Handle on success condition with the decoded message.
            resultContainer.innerHTML = decodedText ;
            strPlan=planContainer.value;
            
            if (strPlan==""){
                playNG();
                resultContainer.style.color = "black";  
                resultDisplay.textContent  = "EMPTY STRING";
                panelTitle.className = "w3-panel w3-orange w3-center"; 
                planContainer.focus();
            } else {
               if (decodedText.search(strPlan)!== -1){
                    playOK();
                    resultContainer.style.color = "black";
                    resultDisplay.textContent  = "PASS";
                    panelTitle.className = "w3-panel w3-green w3-center"; 
                } else {             
                    playNG();
                    resultContainer.style.color = "red";  
                    resultDisplay.textContent  = "FAIL";
                    panelTitle.className = "w3-panel w3-red w3-center"; 
                    
                    html5QrcodeScanner.stop().then((ignore) => {
                    // QR Code scanning is stopped.
                    }).catch((err) => {
                    // Stop failed, handle it.
                    });
                    html5QrcodeScanner.clear();
                } 
            }
            
        }

        function playOK() {
            var audio = new Audio('assets/sounds/beep.mp3');
            audio.play();
        }
        
        function playNG() {
            var audio = new Audio('assets/sounds/error.mp3');
            audio.play();
        }
    }

    var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);
});


