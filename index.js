const fs = require('fs');

function removeDir(path) {
    console.log('Removing dir ', path)
    const list = fs.readdirSync(path);
    for (let i = 0, length = list.length; i < length; i++){
        console.log(`Removing path ${path}/${list[i]}`);
        const stats = fs.statSync(`${path}/${list[i]}`);
        if (stats.isDirectory()){
            console.log('Is a directory');
            removeDir(`${path}/${list[i]}`);
        } else if (stats.isFile){
            console.log('Is a file');
            fs.unlinkSync(`${path}/${list[i]}`);
        }
    }
    fs.rmdirSync(`${path}`);
}

// node index.js myfolder Hola que tal
function createScript(folderName, content){
    console.log(`Creating a folder with name ${folderName}`);
    if (fs.existsSync(`${__dirname}/${folderName}`  )) {
        console.log('Directory exists');
        removeDir(`${__dirname}/${folderName}`)
    }
    fs.mkdirSync(`${__dirname}/${folderName}`);

    console.log(`Writing file with content ${content}`);
    fs.writeFileSync(`${__dirname}/${folderName}/file.txt`, content);

    console.log('Reading file');
    const buffer = fs.readFileSync(`${__dirname}/${folderName}/file.txt`, 'utf8');
    console.log(`Read: ${buffer.toString('utf8')}`)
}

createScript(process.argv[2], process.argv.slice(3).join(' '));