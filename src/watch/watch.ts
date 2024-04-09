export type WatchMode = 'NONE' | 'ADD_ONE_HOUR' | 'ADD_ONE_MINUTE';
export type WatchTheme = 'DARK' | 'LIGHT';
export type WatchDisplay = '24_H' | '12_H';

export class Watch {

    protected currentTime: Date;
    protected currentMode: WatchMode = 'NONE';
    protected currentDisplay: WatchDisplay = '24_H';
    protected currentTheme: WatchTheme = 'LIGHT';

    constructor(private readonly timeZone: number = 0) {
        let date: Date = new Date();
        if (this.timeZone !== 0)
            date.setHours(date.getHours() + timeZone);
        this.currentTime = date;
    }

    getCurrentTime(): string {
        return this.currentTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: this.currentDisplay === '12_H'
        });
    }

    changeMode(): WatchMode {
        if (this.currentMode === 'NONE')
            this.currentMode = 'ADD_ONE_HOUR';
        else if (this.currentMode === 'ADD_ONE_HOUR')
            this.currentMode = 'ADD_ONE_MINUTE';
        else
            this.currentMode = 'NONE';
        return this.currentMode;
    }

    increase(): void {
        switch (this.currentMode) {
            case "ADD_ONE_HOUR":
                this.currentTime.setHours(this.currentTime.getHours() + 1);
                break;
            case "ADD_ONE_MINUTE":
                this.currentTime.setMinutes(this.currentTime.getMinutes() + 1);
                break;
            case "NONE":
                break;
        }
    }

    getTimeZone(): string {
        return 'GMT+' + this.timeZone;
    }

}

export class UpgradedWatch extends Watch {

    changeDisplay(): void {
        this.currentDisplay = this.currentDisplay === '24_H' ? '12_H' : '24_H';
    }

    reset(): void {
        this.currentMode = 'NONE';
    }
}