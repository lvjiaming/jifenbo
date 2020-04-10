

cc.Class({
    extends: cc.Component,

    properties: {
        note: {
            default: null,
            type: cc.Label,
            tooltip: "内容",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (this.node.time) {
            this.scheduleOnce(() => {
                this.node.destroy();
            }, this.node.time);
        }
    },

    start () {

    },

    setNote(str) {
        if (this.note) {
            this.note.string = `${str}...`;
        }
    },

    // update (dt) {},
});
