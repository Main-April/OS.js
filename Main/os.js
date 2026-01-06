const OS = {
    Name: "OS", // Can be changed by another name
    Files: {C: {Users: {ProgramFile:{}, Desktop : {},Documents : {},Downloads : {}}}},
    current_dir: "C/Users",
    Process : {Stack:[], Memory : {}},
    Memory : {},
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
        OS.Process.Run(this,args,option.once?option.once:false);
    }
    get stop(){
        clearInterval(OS.Process.Memory[this.name]);
    }
}
OS.Process.Run = function (process,args,once) {
    if(!once) {OS.Process.Memory[process.name] = setInterval(process.f(args),1); return;}
    f(args);
}
// Environ 75 lignes ici le 01/01/2026 à 00:01. Bonne année 2026 ! 
class Storage{
    constructor(name,value){
        this.name = name;
        this.value = value;
        this.maxLength = 2500000;
        this.init();
    }
    init(){
        OS.Memory[this.name] = this.value;
        this.maxLength -= JSON.parse(OS.Memory).length;
    }
    set setPersistent(){
        localStorage.setItem(OS.Name,JSON.parse(OS.Memory))
    }
}
// Used for the not static-values
class Signal{
    constructor(name,value,cond=null){
        this.name = name;
        this.value = value;
        this.cond = cond;
        this.init();
    }
    init(){globalThis[this.name]=this.value;}
    change(value){
        if(!this.cond) globalThis[this.name] = value;
        else {
            return setInterval(()=>{if(this.cond) globalThis[this.name]=this.value},0)
        }
    }
}
