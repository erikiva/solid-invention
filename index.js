const fs = require('fs');
const fsp = require('fs-promise');
const bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'test-fs',
    level: 'DEBUG',
    src: true
});

async function removeDir(path) {
    logger.info('Removing dir ', path)
    const list = await fsp.readdir(path);
    for (let i = 0, length = list.length; i < length; i++){
        logger.debug(`Removing path ${path}/${list[i]}`);
        const stats = await fsp.stat(`${path}/${list[i]}`);
        if (stats.isDirectory()){
            logger.debug('Is a directory');
            await removeDir(`${path}/${list[i]}`);
        } else if (stats.isFile){
            logger.debug('Is a file');
            await fsp.unlink(`${path}/${list[i]}`);
        }
    }
    await fsp.rmdir(`${path}`);
}

// node index.js myfolder Hola que tal
async function createScript(folderName, content){
    logger.info(`Creating a folder with name ${folderName}`);
    const exists = await fsp.exists(`${__dirname}/${folderName}`);
    if (exists) {
        logger.info('Directory exists');
        await removeDir(`${__dirname}/${folderName}`)
    }
    await fsp.mkdir(`${__dirname}/${folderName}`);

    logger.info(`Writing file with content ${content}`);
    await fsp.writeFile(`${__dirname}/${folderName}/file.txt`, content);

    logger.info('Reading file');
    const buffer = await fsp.readFile(`${__dirname}/${folderName}/file.txt`, 'utf8');
    logger.info(`Read: ${buffer.toString('utf8')}`)
    return 'OK from promise';
}

createScript(process.argv[2], process.argv.slice(3).join(' '))
    .then((data)=>logger.info('OK ', data), 
        (err)=> {
            logger.error('Error', err); 
            process.exit(1)}
    );