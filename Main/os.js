const OS = {
    Name: "OS",
    Files: {C: {Users: {ProgramFile:{}, Desktop : {},Documents : {},Downloads : {}}}},
    current_dir: "C/Users"
};

class File {
    constructor(name,content,path=""){
        this.name = name;
        this.content = content;
        this.path = path;
        this.properties = {
            createdAt : [new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(":"),
            height : this.content.length,
        }
        if(!this.init()) throw new Error("File initialization failed");
    }
     init() {
        if (!this.path) {
            if (!OS.ls()[this.name]) OS.ls()[this.name] = this;
            this.path = new Path(OS.current_dir).abspath(this.name);
            return true;
        }
        const parentPath = this.path.absolute.substring(0, this.path.lastIndexOf("/"));
        return OS.mapPath(parentPath, (current) => {
            current[this.name] = this;
        });
    }
    isExist(path) {return OS.mapPath(path, (current) => {return current[this.name] !== undefined;});}
    set rename(str){this.name = str;}
    set write(str){this.content += str;}
    remove(){OS.ls()[this.name] = undefined;}
}
class Path {
    constructor(path){
        this.absolute  = path;
    }
    set abspath(path){this.absolute = `${this.absolute}/${path}`;}
    get dirs() {return this.absolute.split("/");}
}

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
