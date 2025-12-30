import {OS,File,Path} from './os.js'
const Console = {}
OS.mapPath = function(path,callback){
    const dirs = path.split("/");
    let current = OS.Files;
    for (let dir of dirs) {
        if (!current[dir]) return false;
        current = current[dir];
    }
    callback(current);
    return true;
}

OS.go_to_current_dir = function() {
    const dirs = OS.current_dir.split("/");
    let file = OS.Files;
    for (let dir of dirs) {
        file = file[dir];
    }
    return [file, OS.current_dir];
};

OS.cd = function(dir) {
    if (dir.startsWith("C/")) {
        OS.current_dir = dir;
        return OS.ls();
    }
    let [current, path] = OS.go_to_current_dir();
    if (current[dir] !== undefined) {
        OS.current_dir = path + "/" + dir;
        return current[dir];
    }
    return current;
};

OS.ls = () => OS.go_to_current_dir()[0];

OS.newFile = function (name,content,dir=OS.current_dir){
    OS.cd(dir);
    let file = new File(name, content, dir + "/" + name);
    return file;
}
OS.newDir = function (name,path=OS.current_dir){
    OS.mapPath(path, (current) => {
        current[name] = {};
    });
}

