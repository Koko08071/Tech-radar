
const fs=require("node:fs"),cp=require("node:child_process");
const file="issue22.js";
const before=fs.readFileSync(file,"utf8");
const next=before.replace(/TODAY\\+'S FRAMEWORK/g,"TODAYS FRAMEWORK");
if(next===before)throw Error("Expected build literal quote problem not found");
fs.writeFileSync(file,next);
cp.execFileSync(process.execPath,["--check",file],{stdio:"inherit"});
console.log("PRE-FLIGHT: issue22 script syntax verified");
