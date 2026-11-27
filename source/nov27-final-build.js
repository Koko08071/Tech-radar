const fs=require('fs'),cp=require('child_process');
const css='<style id="radar-no-motion-button">.radar-motion-control{display:none!important}</style>';
const patch=(path)=>{let h=fs.readFileSync(path,'utf8');if(!h.includes('radar-no-motion-button')){if(!h.includes('</head>'))throw Error('Missing head');h=h.replace('</head>',css+'</head>');fs.writeFileSync(path,h)} };
patch('nov27-final.html');
for(const s of ['nov25-visual-build.js','nov26-final-release.js','nov27-final-release.js'])cp.execFileSync('node',[s],{stdio:'inherit',timeout:360000});
patch('src/index.html');
