import {OS,File,Path} from './os.js'

const Terminal = {}

Terminal.mapPath = function(path,callback){
    const dirs = new Path(path).dirs;
    let current = OS.Files;
    for (let dir of dirs) {
        if (!current[dir]) return false;
        current = current[dir];
    }
    callback(current);
    return true;
}

Terminal.go_to_current_dir = function() {
    const dirs = new Path(OS.current_dir).dirs;
    let files = OS.Files;
    for (let dir of dirs) {
        files = files[dir];
    }
    return [files, OS.current_dir];
};

Terminal.cd = function(dir) {
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

Terminal.ls = () => OS.go_to_current_dir()[0];

Terminal.mkfile = function (name,content,dir=OS.current_dir){
    OS.cd(dir);
    let file = new File(name, content, dir + "/" + name);
    return file;
}

Terminal.mkdir = function (name,path=OS.current_dir){
    OS.mapPath(path, (current) => {
        current[name] = {};
    });
}
Terminal.repeat = function(n,callback){
    let cmd;
    for(let i = 0; i<n;i++){
        if(typeof callback==="string") {
            cmd = callback.split(" "); 
            Terminal[cmd[0]](cmd.slice(1,cmd.length));
        }
        else {
            callback() 
        }
    }
}

OS.Terminal = Terminal;




