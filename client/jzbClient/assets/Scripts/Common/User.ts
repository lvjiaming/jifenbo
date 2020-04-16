export class User {
    private static user: User = null;
    public static getInstance(): User {
        if (!this.user) {
            this.user = new User();
        }
        return this.user;
    }
    private _userId  = null;
    public set userid (id: any) {
        this._userId = id;
    }
    public get userid (): any {
        return this._userId;
    }

    private _name  = null;
    public set name (n: string) {
        this._name = n;
    }
    public get name (): string {
        return this._name;
    }

    /**
     *  初始化玩家信息
     * @param userInfo
     */
    public init(userInfo: any): void {
        this.name = userInfo.getName();
        this.userid = userInfo.getId();
    }
}