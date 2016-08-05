import nodefs = require('fs');
import path = require('path');

export type Mode = 'dev' | 'local' | 'global';

export interface Description {
    name: string;
    path: string;
    mode: Mode;
}

export function describeUsing(cwd: string, pathToGlobalModules: string, fs: typeof nodefs): (moduleName: string) => Description {

    let candidates = [
        new DevModule(cwd),
        new LocalModule(cwd, fs),
        new GlobalModule(pathToGlobalModules, fs),
        new NotFoundModule(),
    ];

    return (moduleName: string) => candidates
        .find( (candidate, i) => candidate.existsFor(moduleName) )
        .descriptionOf(moduleName);
}

// --

interface CandidateModuleLocation {
    existsFor(moduleName: string): boolean;
    descriptionOf(moduleName: string): Description;
}

class DevModule implements CandidateModuleLocation {

    constructor(private cwd: string) { }

    existsFor(moduleName: string): boolean {
        return this.folderName() === moduleName;
    }

    descriptionOf(moduleName: string): Description {
        return {
            name: moduleName,
            path: this.cwd,
            mode: 'dev',
        };
    }

    // --

    private folderName(): string {
        let parent = path.resolve(this.cwd, '..'),
            folder = this.cwd.replace(parent, '').substring(1);

        return folder;
    }
}

class LocalModule implements CandidateModuleLocation {

    constructor(private cwd: string, private fs: typeof nodefs) { }

    existsFor(moduleName: string): boolean {
        return directoryExists(this.fs, this.pathFor(moduleName));
    }

    descriptionOf(moduleName: string): Description {
        return {
            name: moduleName,
            path: this.pathFor(moduleName),
            mode: 'local',
        };
    }

    // --

    private pathFor(moduleName: string) {
        return path.resolve(this.cwd, 'node_modules', moduleName);
    }
}

class GlobalModule implements CandidateModuleLocation {

    constructor(private globalModules: string, private fs: typeof nodefs) {
    }

    existsFor(moduleName: string): boolean {
        return directoryExists(this.fs, this.pathFor(moduleName));
    }

    descriptionOf(moduleName: string): Description {
        return {
            name: moduleName,
            path: this.pathFor(moduleName),
            mode: 'global',
        };
    }

    // --

    private pathFor(moduleName: string) {
        return path.resolve(this.globalModules, moduleName);
    }
}

class NotFoundModule implements CandidateModuleLocation {
    existsFor(moduleName: string): boolean {
        return true;
    }

    descriptionOf(moduleName: string): Description {
        return undefined;
    }
}

function directoryExists(fs: typeof nodefs, pathToDirectory: string) {
    try {
        return fs.statSync(pathToDirectory).isDirectory();
    }
    catch (err) {
        return false;
    }
}
