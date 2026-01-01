const OS = {
    Name: "OS", // Can be changed by another name
    Files: {C: {Users: {ProgramFile:{}, Desktop : {},Documents : {},Downloads : {}}}},
    current_dir: "C/Users",
    Process : {Stack:[], Memory : {},},
    
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
    get toString() {return this.absolute;}
    get location() {
        let file = OS.Files;
        let dirs = this.dirs;
        for(dir of dirs){
            file = file[dir];
        }
        return file;
    }
}

class Process {
    constructor(name,f,alloc=f.toString().length){
        this.name = name;
        this.f = f;
        this.alloc = alloc;
    }
    call(args,option){
        OS.Process.Stack.push(this.f);
        OS.Process.Run(this.f,args,option.once?option.once:false);
    }
    get stop(){
        clearInterval(OS.Process.Memory[this.name])
    }
}
OS.Process.Run = function (f,args,once) {
    if(!once) {OS.Process.Memory[f.name] = setInterval(f(args),1); return;}
    f(args);
}
// Environ 75 lignes le 01/01/2026 à 00:01. Bonne année 2026 ! 

