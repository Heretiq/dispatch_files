/* 
    IMPORTANT: NEEDED ENCODING - 1251
*/

/* 
    This Windows script host JScript utility handles files between the source and destination folders.
    Any file or files (maximum of 9 at a time) submitted to the script via drag-and-drop towards 
    move_to_FROM_oak.bat or move_to_FOR_oak.bat files of their shortcuts would be processed as follows:
    - destination folder would be selected according to the first argument in the bat file ("FOR" or "FROM")
    - a copy of the file would be placed to the destination folder (particular storage);
    - another copy of the file would be placed to the RECU folder (general storage), adding prefix and postfix to the file name;
    - the third copy of the file would remain in the source folder, other then RECU or one of the SCANNED folders;
    - errors would be logged to the log file and displayed in the system message box.
*/
var FSO = WScript.CreateObject("Scripting.FileSystemObject");
var shell = WScript.CreateObject("WScript.Shell");

//the following paths and prefixes should de modified according to the environment where the utility will be applied
var prefix = "name_";
var postfix = "_company.";
var parentFolder = "D:\\YandexDisk\\Программирование скриптов\\скрипты\\dispatch_files";
var recuFolderPath = FSO.BuildPath(parentFolder, "RECU");
var scanFolderPath_1 = FSO.BuildPath(parentFolder, "SCAN");
var scanFolderPath_2 = FSO.BuildPath(parentFolder, "SCANNED_DOCS");

var targetFolderPath;
var fromFolderPath = FSO.BuildPath(parentFolder, "FROM");
var forFolderPath = FSO.BuildPath(parentFolder, "FOR");
	
var errorMessage;
var first = true;
var log = FSO.OpenTextFile(parentFolder + "\\log.txt", 8, true);
var iterator = new Enumerator(WScript.Arguments);

for (; !iterator.atEnd(); iterator.moveNext()) {
    var arg = iterator.item();
    //applies the destination marker from the cmd arguments line 
    if(first){
        if(arg === "FROM"){
            targetFolderPath = fromFolderPath;
        } else if(arg === "FOR"){
            targetFolderPath = forFolderPath;
        }
        first = false;
        continue;
    }
    if(arg != ""){
        processFile(arg);
    } else break;
}
log.Close();

//renames (if needed) and manipulates the files according to the defined source and destination
function processFile(sourcePath){
    var sourceFolder = FSO.GetParentFolderName(sourcePath);
	var fileName = FSO.GetBaseName(sourcePath);
    var fileExt = FSO.GetExtensionName(sourcePath);
    var recuFileName = prefix + fileName + postfix + fileExt;
	var targetFileName = FSO.GetFileName(sourcePath);

	var report = "";
    try{
        var recuPath = FSO.BuildPath(recuFolderPath, recuFileName);
        var targetPath = FSO.BuildPath(targetFolderPath, targetFileName);
        FSO.CopyFile(sourcePath, targetPath);
        if(thirdCopyRequired(sourceFolder)){
            FSO.CopyFile(sourcePath, recuPath);
        } else{
            FSO.MoveFile(sourcePath, recuPath);
        }
        report = getNow() + " : " + fileName;
    } catch(error){
            errorMessage = "\tINNER ERROR : " + getNow() + " : " + error.message + " : " + targetFileName;
			shell.Popup(errorMessage);
			WScript.Echo(errorMessage);
            report = errorMessage;
    }
    log.WriteLine(report);
}

//if a file is located in any folder other than RECU or scan folder, its copy will remain in the source folder
function thirdCopyRequired(folderPath){
    if(folderPath == recuFolderPath || folderPath == scanFolderPath_1 || folderPath == scanFolderPath_2){
        return false;
    }
    return true;
}

//get the time and date in format "hh:mm:ss MMM DD,YYYY"
function getNow(){
    var d = new Date();
    var segments = d.toString().split(" ");
    var now = segments[3] + " " +  segments[1] + " " + segments[2] + "," + segments[5]; 
    return now;
}
