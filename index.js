const fs = require('fs');
const fsp = require('fs-promise');

async function removeDir(path) {
    console.log('Removing dir ', path)
    const list = await fsp.readdir(path);
    for (let i = 0, length = list.length; i < length; i++){
        console.log(`Removing path ${path}/${list[i]}`);
        const stats = await fsp.stat(`${path}/${list[i]}`);
        if (stats.isDirectory()){
            console.log('Is a directory');
            await removeDir(`${path}/${list[i]}`);
        } else if (stats.isFile){
            console.log('Is a file');
            await fsp.unlink(`${path}/${list[i]}`);
        }
    }
    await fsp.rmdir(`${path}`);
}

// node index.js myfolder Hola que tal
async function createScript(folderName, content){
    console.log(`Creating a folder with name ${folderName}`);
    const exists = await fsp.exists(`${__dirname}/${folderName}`);
    if (exists) {
        console.log('Directory exists');
        await removeDir(`${__dirname}/${folderName}`)
    }
    await fsp.mkdir(`${__dirname}/${folderName}`);

    console.log(`Writing file with content ${content}`);
    await fsp.writeFile(`${__dirname}/${folderName}/file.txt`, content);

    console.log('Reading file');
    const buffer = await fsp.readFile(`${__dirname}/${folderName}/file.txt`, 'utf8');
    console.log(`Read: ${buffer.toString('utf8')}`)
    return 'OK from promise';
}

createScript(process.argv[2], process.argv.slice(3).join(' '))
    .then((data)=>console.log('OK ', data), 
        (err)=> {
            console.error('Error', err); 
            process.exit(1)}
    );