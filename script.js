var convertBtn = document.querySelector('.convert-button');
var configInput = document.querySelector('.config-input');
var downloadBtn = document.querySelector('.download-button');

configInput.addEventListener('change', getFile);

var fileContent = "";

var questConfigTemplate = {
    "Mod Enabled": true,
    "Judgment 1 Threshold": 115,
    "Judgment 1 Enabled": true,
    "Judgment 1 Text": "Fantastic%n&s",
    "Judgment 1 Color": {
        "r": 0.0,
        "g": 255.0,
        "b": 0.0,
        "a": 255.0
    },
    "Judgment 2 Threshold": 101,
    "Judgment 2 Enabled": true,
    "Judgment 2 Text": "<size=80%>Excellent</size>%n%s",
    "Judgment 2 Color": {
        "r": 175.949996948242,
        "g": 255.0,
        "b": 0.0,
        "a": 255.0
    },
    "Judgment 3 Threshold": 90,
    "Judgment 3 Enabled": true,
    "Judgment 3 Text": "<size=80%>Great</size>%n%s",
    "Judgment 3 Color": {
        "r": 255.0,
        "g": 250,
        "b": 0.0,
        "a": 255.0
    },
    "Judgment 4 Threshold": 80,
    "Judgment 4 Enabled": true,
    "Judgment 4 Text": "<size=80%>Good</size>%n%s",
    "Judgment 4 Color": {
        "r": 255.0,
        "g": 153.0,
        "b": 0.0,
        "a": 255.0
    },
    "Judgment 5 Threshold": 60,
    "Judgment 5 Enabled": true,
    "Judgment 5 Text": "<size=80%>Decent</size>%n%s",
    "Judgment 5 Color": {
        "r": 255.0,
        "g": 0.0,
        "b": 0.0,
        "a": 255.0
    },
    "Judgment 6 Threshold": 0,
    "Judgment 6 Enabled": true,
    "Judgment 6 Text": "<size=80%>Way Off</size>%n%s",
    "Judgment 6 Color": {
        "r": 127.5,
        "g": 0.0,
        "b": 0.0,
        "a": 255.0
    }
}

downloadBtn.addEventListener('click', () => {
    saveTextAsFile(document.getElementById('content-target').value, 'hitscorevisualizer.json');
});

function getFile(event) 
{
	const input = event.target;
    if ('files' in input && input.files.length > 0) {
	    placeFileContent(document.getElementById('content-target'), input.files[0]);
    }
}

function placeFileContent(target, file) {
	readFileContent(file).then(content => {
  	    target.value = content;
        fileContent = content;
    }).catch(error => console.log(error));
}

function readFileContent(file) {
	const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
}

convertBtn.addEventListener('click', () => {
    if(fileContent != "") {
        if(fileContent.startsWith("{") && fileContent.endsWith("}")) {
            var pcJSON = JSON.parse(fileContent);
            //console.log(pcJSON);
            //console.log(pcJSON.judgments);
            for(var i = 0; i < pcJSON.judgments.length; i++) {
                setJudgmentData(i, pcJSON.judgments[i]);
            }
            document.getElementById('content-target').value = JSON.stringify(questConfigTemplate, null, 2);
            console.log(questConfigTemplate);
        }
    }
})



function setJudgmentData(judgmentID, judgment) {
    console.log(judgment);
    switch(judgmentID) {
        case 0:
            questConfigTemplate["Judgment 1 Color"] = ColorConverter(judgment.color);
            questConfigTemplate["Judgment 1 Text"] = RemoveStrippedFormats(judgment.text);
            questConfigTemplate["Judgment 1 Threshold"] = judgment.threshold;
            break;
        case 1:
            questConfigTemplate["Judgment 2 Color"] = ColorConverter(judgment.color);
            questConfigTemplate["Judgment 2 Text"] = RemoveStrippedFormats(judgment.text);
            questConfigTemplate["Judgment 2 Threshold"] = judgment.threshold;
            break;
        case 2:
            questConfigTemplate["Judgment 3 Color"] = ColorConverter(judgment.color);
            questConfigTemplate["Judgment 3 Text"] = RemoveStrippedFormats(judgment.text);
            questConfigTemplate["Judgment 3 Threshold"] = judgment.threshold;
            break;
        case 3:
            questConfigTemplate["Judgment 4 Color"] = ColorConverter(judgment.color);
            questConfigTemplate["Judgment 4 Text"] = RemoveStrippedFormats(judgment.text);
            questConfigTemplate["Judgment 4 Threshold"] = judgment.threshold;
            break;
        case 4:
            questConfigTemplate["Judgment 5 Color"] = ColorConverter(judgment.color);
            questConfigTemplate["Judgment 5 Text"] = RemoveStrippedFormats(judgment.text);
            questConfigTemplate["Judgment 5 Threshold"] = judgment.threshold;
            break;
        case 5:
            questConfigTemplate["Judgment 6 Color"] = ColorConverter(judgment.color);
            questConfigTemplate["Judgment 6 Text"] = RemoveStrippedFormats(judgment.text);
            questConfigTemplate["Judgment 6 Threshold"] = judgment.threshold;
            break;
    }
}

function ColorConverter(oldColor) {
    var newColor = [0,0,0,0];
    newColor[0] = oldColor[0] * 255;
    newColor[1] = oldColor[1] * 255;
    newColor[2] = oldColor[2] * 255;
    newColor[3] = oldColor[3] * 255;
    return newColor;
}

function RemoveStrippedFormats(oldText) {
    var newText = oldText;
    newText = newText.replace("%B", "");
    newText = newText.replace("%C", "");
    newText = newText.replace("%A", "");
    newText = newText.replace("%T", "");
    return newText;
}

function saveTextAsFile(textToWrite, fileNameToSaveAs) {
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
    // Chrome allows the link to be clicked
    // without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else {
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    }
     
    downloadLink.click();
}