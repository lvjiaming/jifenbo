cc.resLoad = {};
cc.resLoad.dirResList = {};
cc.resLoad.loadDirRes = (path, callBack) => {
    cc.loader.loadResDir(path, (err, dir) => {
        if (err) {
            cc.error(`error: ${err}`);
            return;
        }
        const pathList = path.split("/");
        if (!cc.resLoad.dirResList[pathList[pathList.length - 1]]) {
            cc.resLoad.dirResList[pathList[pathList.length - 1]] = {};
        }
        for (let item in dir) {
            if (dir[item] instanceof cc.Prefab) {
                cc.resLoad.dirResList[pathList[pathList.length - 1]][dir[item].name.toUpperCase()] = dir[item];
            } else if (dir[item] instanceof cc.SpriteAtlas) {
                xx.sys.objectToArray(dir[item]._spriteFrames).forEach((tex) => {
                    tex._texture.notRelease = true;
                });
                cc.resLoad.dirResList[pathList[pathList.length - 1]][dir[item].name.toUpperCase().split(".")[0]] = dir[item];
            }
        }
        if (callBack) {
            callBack();
        }
    });
};
cc.resLoad.releaseDirRes = (path) => {
    const pathList = path.split("/");
    cc.loader.releaseResDir(path);
    cc.resLoad.dirResList[pathList[pathList.length - 1]] = {};
};