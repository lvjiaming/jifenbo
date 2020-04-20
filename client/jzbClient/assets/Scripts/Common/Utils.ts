export class Utils {
    public static getTime(time: number): string {
        const date = new Date(time * 1000);
        const o = {
            "y": date.getFullYear(),
            "M": date.getMonth()+1,
            "d": date.getDate(),
            "h": date.getHours(),
            "m": date.getMinutes(),
            "s": date.getSeconds(),
        };
        cc.log(o);
        o.M = (o.M<10)?('0'+o.M):o.M;
        o.d = (o.d<10)?('0'+o.d):o.d;
        o.h = (o.h<10)?('0'+o.h):o.h;
        o.m = (o.m<10)?('0'+o.m):o.m;
        o.s = (o.s<10)?('0'+o.s):o.s;
        return `${o.y}-${o.M}-${o.d} ${o.h}:${o.m}:${o.s}`
    }
}