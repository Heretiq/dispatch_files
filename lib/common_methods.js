//===========COMMON METHODS===================

// IMPORTANT : COPY THIS FUNCTION TO THE TARGET FILE !!!!
// eval(importFromJSFile("lib/common_methods.js"));
//импортирует контент другого файла для использования через eval()
function importFromJSFile(fileName){
    // Открываем файл с другим скриптом
    var fso = WScript.CreateObject("Scripting.FileSystemObject");
    var fileStream = fso.OpenTextFile(fileName, 1);
    var importedContent = fileStream.ReadAll();
    fileStream.Close();
    return importedContent;
} // IMPORTANT : COPY THIS FUNCTION TO THE TARGET FILE !!!!

function getShell() {
    return WScript.CreateObject("WScript.Shell");
}

function getFSO() {
    return WScript.CreateObject("Scripting.FileSystemObject");
}

function format(str, array) {
    var formatted = str;
    for (var i = 0; i < array.length; i++) {
        var regexNum = new RegExp("\\$\\{" + i + "\\}", "g");
        var regexText = new RegExp("\\$\\{" + array[i] + "\\}", "g");
        var regex = [regexNum, regexText];
        for (var r = 0; r < array.length; r++) {
            if (formatted.match(regex[r])) {
                formatted = formatted.replace(regex[r], array[i]);
            }
        }
    }
    return formatted;
}

function echof(str, paramArray) { WScript.Echo(format(str, paramArray)); }

function echo(str) { WScript.Echo(str); }

function debugArgs(args) { // : Arguments
    var array = new Array();
    for (var i = 0; i < args.Length; i++) {
        array.push(args(i));
    }
    debug("ARGS", array)
}

function debugHashMap(hashMap) { // : Object<key, value>
    for(var key in hashMap){
        debug(key + " = " + hashMap[key])
    }
}

function debug(objName, obj) { // : string, object
    var objValue = '';
    // if((typeof(obj) == "object" || typeof(obj) == "string") && obj != null){
    if(obj != null){
        objValue = ' = ' + obj;
    }
    WScript.Echo('debug: ' + objName + objValue);
}

function getNow(){
    var d = new Date();
    var segments = d.toString().split(" ");
    //get the time and date in format "hh:mm:ss MMM DD,YYYY"
    return segments[3] + " " +  segments[1] + " " + segments[2] + "," + segments[5];
}

function cleanupCodeAfterDebug() {
    // target = "// debug"
    // regex = .*//\s?debug.*\(.*\n
}

function printHello(){
    // debug("Hello")
    return "Hello"
}

function checkMatch(string, regex){
    if(string.match(regex)) {
        echo(string + " MATCHES the regex " + regex);
    } else{
        echo("no match");
    }
}










/* function debug(str) {
    WScript.Echo('debug: ' + str);
} */

/* function debugg(objName, obj) {
    WScript.Echo('debug: ' + objName + ' = ' + obj);
} */

/* function debugArgs(args) { // : Arguments
    var argString = '';
    var coma = '; ';
    for (var i = 0; i < args.Length; i++) {
        if (args.Length - i === 1) {
            coma = '';
        }
        argString += args(i) + coma;
    }
    debug("ARGS", argString)
} */

/* function debugArr(arrayName, array) {
    var arrayAsString = '';
    var coma = '; ';
    var size = 0;
    var isArray = array instanceof Array;
    size = isArray ? array.length : array.Length;
    for (var i = 0; i < size; i++) {
        if (size - i === 1) {
            coma = '';
        }
        arrayAsString += isArray ? array[i] : array(i);
        arrayAsString += coma;
    }
    debug(arrayName, arrayAsString)
} */