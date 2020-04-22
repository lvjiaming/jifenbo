// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import construct = Reflect.construct;
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    @property({
        type: cc.Label,
        tooltip: "当前年",
    })
    yearLab = null;

    @property({
        type: cc.Label,
        tooltip: "月",
    })
    monLab = null;

    @property({
        type: cc.Node,
        tooltip: "日期的容器"
    })
    dayContent = null;

    @property({
        type: cc.Node,
        tooltip: "日期"
    })
    dayItem = null;

    @property({
        type: cc.Node,
        tooltip: "日期界面"
    })
    calendarPlane = null;

    @property({
        type: cc.Node,
        tooltip: "时间界面"
    })
    timePlane = null;

    @property({
        type: cc.Label,
        tooltip: "时间界面的日期"
    })
    timePlaneCalendarLab = null;

    @property({
        type: cc.EditBox,
        tooltip: "时输入框"
    })
    hourEditBox = null;

    @property({
        type: cc.EditBox,
        tooltip: "分输入框"
    })
    mEditBox = null;

    @property({
        type: cc.EditBox,
        tooltip: "秒输入框"
    })
    sEditBox = null;

    private _SPACE_X: number = 55;
    private _SPACE_Y: number = -35;
    private _ONE_LINE_NUM: number = 7;

    private _curYear: number = 0; // 当前年
    private _curMon: number = 0; // 当前月
    private _curDay: number = 0; // 当前日

    private _dayNodeList: Array<cc.Node> = []; // 天数的节点集合

    onLoad () {
        const date = new Date();
        this._curYear = date.getFullYear();
        this._curMon = date.getMonth() + 1;
        this._isShowCalendar(true);
        this._initDayList();
        this._init();
    }

    start () {

    }

    /**
     *  初始化
     * @private
     */
    private _initDayList(): void {
        if (this.dayItem && this.dayContent) {
            for (let index = 0; index < 31; index++) {
                const day = cc.instantiate(this.dayItem);
                this.dayContent.addChild(day);
                this._dayNodeList.push(day);
            }
        }
    }

    /**
     *  初始化
     * @private
     */
    private _init(): void {

        if (this.yearLab) {
            this.yearLab.string = this._curYear;
        }
        if (this.monLab) {
            this.monLab.string = this._curMon;
        }

        if (this._dayNodeList.length == 0) {
            cc.log("dayNodeList未初始化");
        } else {
            this._dayNodeList.forEach((item: cc.Node) => {
                item.active = false;
            });
            const days = this._getMonthsDay(this._curYear, this._curMon);
            const firstDay = this._getMonthFirst(this._curYear, this._curMon);
            cc.log(days, firstDay);
            let firstIndex = firstDay;
            if (firstDay == 7) {
                firstIndex = 0;
            }
            let lineNum = 0;
            for (let index = 0; index < days; index++) {
                const curDay = this._dayNodeList[index];
                curDay.x = firstIndex * this._SPACE_X;
                curDay.y = lineNum * this._SPACE_Y;
                curDay.active = true;
                this._setDay(curDay, index + 1);
                firstIndex++;
                if (firstIndex > this._ONE_LINE_NUM - 1) {
                    firstIndex = 0;
                    lineNum++;
                }
            }
        }
    }

    /**
     *  初始化时间界面
     * @private
     */
    private _initTimePlane(): void {
        if (this.timePlaneCalendarLab) {
            this.timePlaneCalendarLab.string = `${this._curYear}-${this._curMon}-${this._curDay}`;
        }
    }

    private _getDay(dayNode: cc.Node): number {
        const day = dayNode.getChildByName("Day");
        let num = 0;
        if (day) {
            num = parseInt(day.getComponent(cc.Label).string);
        }
        return num;
    }

    private _setDay(dayNode: cc.Node, num: number): void {
        const day = dayNode.getChildByName("Day");
        if (day) {
            day.getComponent(cc.Label).string = num;
        }
    }

    /**
     *  获取这年这月多少天
     * @param year
     * @param mon
     * @returns {number}
     * @private
     */
    private _getMonthsDay(year: number, mon: number): number {
        const d = new Date(year, mon, 0);
        const days = d.getDate();
        return days;
    }

    /**
     *  获取这年这月第一天是星期几
     * @param year
     * @param mon
     * @returns {number}
     * @private
     */
    private _getMonthFirst(year: number, mon: number): number {
        const newDate = new Date();
        newDate.setFullYear(year);
        newDate.setMonth(mon - 1);
        newDate.setDate(1);
        return newDate.getDay();
    }

    /**
     *  选择天数
     */
    public onSelectDay(event: cc.Event): void {
        let num = this._getDay(event.target);
        this._curDay = num;
        this._isShowCalendar(false);
        // cc.log("日期：", num);
    }

    public onYearAdd(): void {
        const date = new Date();
        const curYear = date.getFullYear();
        this._curYear++;
        if (this._curYear > curYear) {
            this._curYear = curYear
        } else {
            this._init();
        }
    }

    public onYearJian(): void {
        const minYear = 1949;
        this._curYear--;
        if (this._curYear < minYear) {
            this._curYear = minYear
        } else {
            this._init();
        }
    }

    public onMonAdd(): void {
        this._curMon++;
        if (this._curMon > 12) {
            this._curMon = 1;
        }
        this._init();
    }

    public onMonJian(): void {
        this._curMon--;
        if (this._curMon < 1) {
            this._curMon = 12;
        }
        this._init();
    }

    public onCloseClick(): void {
        this._close();
    }

    private _close(): void {
        this.node.destroy();
    }

    private _isShowCalendar(isShow: boolean): void {
        if (this.calendarPlane && this.timePlane) {
            this.calendarPlane.active = isShow;
            this.timePlane.active = !isShow;
            if (!isShow) {
                this._initTimePlane();
            }
        }
    }


    /**
     *  返回日期
     */
    public onReCalendar(): void {
        this._isShowCalendar(true);
    }

    public onFixBtnClick(): void {
        let hour = this.hourEditBox.string || "00";
        let m = this.mEditBox.string || "00";
        let s = this.sEditBox.string || "00";
        hour = parseInt(hour) < 10 ? `0${parseInt(hour)}` : parseInt(hour);
        m = parseInt(m) < 10 ? `0${parseInt(m)}` : parseInt(m);
        s = parseInt(s) < 10 ? `0${parseInt(s)}` : parseInt(s);
        const time = `${this._curYear}-${this._curMon}-${this._curDay} ${hour}:${m}:${s}`;
        // cc.log("时间", time);
        if (this.node.cb && this.node.cb instanceof Function) {
            this.node.cb(time);
        }
        this._close();
    }

    public hourReturnClick(): void {
        if (this.hourEditBox) {
            let val = parseInt(this.hourEditBox.string);
            if (val > 0 && val < 10) {
                this.hourEditBox.string = `0${val}`;
            } else {
                if (val >= 24) {
                    this.hourEditBox.string = "23";
                }
                if (val < 0) {
                    this.hourEditBox.string = "00";
                }
            }
        }
    }

    public mReturnClick(): void {
        if (this.mEditBox) {
            let val = parseInt(this.mEditBox.string);
            if (val > 0 && val < 10) {
                this.mEditBox.string = `0${val}`;
            } else {
                if (val > 59) {
                    this.mEditBox.string = "59";
                }
                if (val < 0) {
                    this.mEditBox.string = "00";
                }
            }
        }
    }
    public sReturnClick(): void {
        if (this.sEditBox) {
            let val = parseInt(this.sEditBox.string);
            if (val > 0 && val < 10) {
                this.sEditBox.string = `0${val}`;
            } else {
                if (val > 59) {
                    this.sEditBox.string = "59";
                }
                if (val < 0) {
                    this.sEditBox.string = "00";
                }
            }
        }
    }
    // update (dt) {}
}
