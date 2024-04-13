export type WatchMode = 'NONE' | 'ADD_ONE_HOUR' | 'ADD_ONE_MINUTE';
export type WatchTheme = 'DARK' | 'LIGHT';
export type WatchDisplay = '24_H' | '12_H';

export enum WatchBtn {
    MODE = 0,
    ADD = 1,
    LIGHT = 2,
    RESET = 3,
    DISPLAY = 4
}

export class Watch {

    protected currentMode: WatchMode = 'NONE';
    protected currentDisplay: WatchDisplay = '24_H';
    protected currentTheme: WatchTheme = 'LIGHT';
    protected modHour: number = 0
    protected modMinute: number = 0

    protected mainContainer: HTMLElement;
    protected watchDisplay: HTMLElement;
    protected watchBackground: HTMLElement;
    protected watchBtns: NodeListOf<HTMLButtonElement>

    constructor(protected readonly mainContainerId: string, protected readonly timeZone: number = 0) {
        this.mainContainer = document.getElementById(this.mainContainerId);
        this.addWatchToDOM();
    }

    addWatchToDOM(): void {
        const template: HTMLTemplateElement = document.getElementById("watchTemplate") as HTMLTemplateElement;
        const watchElement: HTMLElement = template.content.cloneNode(true) as HTMLElement;
        this.watchDisplay = watchElement.querySelector(".clockDisplay");
        this.watchBtns = watchElement.querySelectorAll(".watchBtn");
        this.watchBackground = watchElement.querySelector(".watchBackground");
        this.addBtnClickEventListener();
        this.addBtnHoverEventListener();
        if (this.timeZone)
            (this.watchDisplay.children[2] as HTMLElement).innerText = "GMT+" + this.timeZone;
        this.mainContainer.appendChild(watchElement);
    }

    addBtnClickEventListener(): void {
        this.watchBtns.item(WatchBtn.MODE).addEventListener("click", () => this.changeMode());
        this.watchBtns.item(WatchBtn.ADD).addEventListener("click", () => this.increase());
        this.watchBtns.item(WatchBtn.LIGHT).addEventListener("click", () => this.changeTheme());
    }

    addBtnHoverEventListener(): void {
        Object.keys(WatchBtn).forEach((k: keyof typeof WatchBtn) => {
            const btnElement: HTMLButtonElement = this.watchBtns.item(WatchBtn[k]);
            btnElement.addEventListener("mouseover", () => {
                (this.watchDisplay.children[0] as HTMLElement).innerText = k.toLowerCase();
            });
            btnElement.addEventListener("mouseout", () => {
                (this.watchDisplay.children[0] as HTMLElement).innerText = "---";
            });
        });
    }

    start(): number {
        return window.setInterval(() => {
            (this.watchDisplay.children[1] as HTMLElement).innerText = this.getCurrentTime()
        }, 1000)
    }

    getCurrentTime(): string {
        let currentTime: Date = new Date();
        if (this.timeZone !== 0)
            currentTime.setHours(currentTime.getHours() + this.timeZone);
        currentTime.setHours(currentTime.getHours() + this.modHour);
        currentTime.setMinutes(currentTime.getMinutes() + this.modMinute);
        return currentTime.toLocaleTimeString('en-US', {
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
                this.modHour += 1;
                break;
            case "ADD_ONE_MINUTE":
                this.modMinute += 1;
                break;
            case "NONE":
                break;
        }
    }

    changeTheme(): void {
        this.currentTheme = this.currentTheme === 'LIGHT' ? 'DARK' : 'LIGHT';
        if (this.currentTheme === 'LIGHT') {
            this.watchDisplay.style.color = "dodgerblue";
            this.watchBackground.style.backgroundColor = "transparent";
        } else {
            this.watchDisplay.style.color = "white";
            this.watchBackground.style.backgroundColor = "black";
        }
    }
}

export class UpgradedWatch extends Watch {

    constructor(protected readonly mainContainerId: string, protected readonly timeZone: number = 0) {
        super(mainContainerId, timeZone);
        this.watchBtns.item(WatchBtn.RESET).style.display = "block";
        this.watchBtns.item(WatchBtn.DISPLAY).style.display = "block";
    }

    addBtnClickEventListener(): void {
        super.addBtnClickEventListener();
        this.watchBtns.item(WatchBtn.RESET).addEventListener("click", () => {
            this.resetMode();
        });
        this.watchBtns.item(WatchBtn.DISPLAY).addEventListener("click", () => {
            this.changeDisplay();
        });
    }

    changeDisplay(): void {
        this.currentDisplay = this.currentDisplay === '24_H' ? '12_H' : '24_H';
    }

    resetMode(): void {
        this.currentMode = 'NONE';
    }
}