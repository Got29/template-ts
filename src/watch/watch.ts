export type WatchMode = 'NONE' | 'ADD_ONE_HOUR' | 'ADD_ONE_MINUTE';
export type WatchTheme = 'DARK' | 'LIGHT';
export type WatchDisplay = '24_H' | '12_H';

export class Watch {

    protected currentMode: WatchMode = 'NONE';
    protected currentDisplay: WatchDisplay = '24_H';
    protected currentTheme: WatchTheme = 'LIGHT';
    protected modHour: number = 0
    protected modMinute: number = 0

    protected mainContainer: HTMLElement;
    protected watchElement: HTMLElement;
    protected watchDisplay: HTMLElement;

    constructor(protected readonly mainContainerId: string, protected readonly timeZone: number = 0) {
        this.mainContainer = document.getElementById(this.mainContainerId);
        this.addWatchToDOM();
    }

    addWatchToDOM(): void {
        const template: HTMLTemplateElement = document.getElementById("watchTemplate") as HTMLTemplateElement;
        this.watchElement = template.content.cloneNode(true) as HTMLElement;
        this.addBtnEventListener();
        this.watchDisplay = this.watchElement.querySelector(".clockDisplay");
        if (this.timeZone)
            (this.watchDisplay.children[2] as HTMLElement).innerText = "GMT+" + this.timeZone;
        this.mainContainer.appendChild(this.watchElement);
    }

    addBtnEventListener(): NodeListOf<HTMLButtonElement> {
        const watchBtns: NodeListOf<HTMLButtonElement> = this.watchElement.querySelectorAll(".watchBtn");
        watchBtns.item(0).addEventListener("click", () => this.changeMode());
        watchBtns.item(1).addEventListener("click", () => this.increase());
        watchBtns.item(2).addEventListener("click", () => this.changeTheme());
        return watchBtns;
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
            this.watchDisplay.style.color = "white";
            this.watchDisplay.style.backgroundColor = "black";
        } else {
            this.watchDisplay.style.color = "dodgerblue";
            this.watchDisplay.style.backgroundColor = "transparent";
        }
    }
}

export class UpgradedWatch extends Watch {

    constructor(protected readonly mainContainerId: string, protected readonly timeZone: number = 0) {
        super(mainContainerId, timeZone);
    }

    addBtnEventListener(): NodeListOf<HTMLButtonElement> {
        const watchBtns: NodeListOf<HTMLButtonElement> = super.addBtnEventListener();
        watchBtns.item(3).addEventListener("click", () => {
            this.reset();
        });
        watchBtns.item(4).addEventListener("click", () => {
            this.changeDisplay();
        });
        return watchBtns;
    }

    changeDisplay(): void {
        this.currentDisplay = this.currentDisplay === '24_H' ? '12_H' : '24_H';
    }

    reset(): void {
        this.currentMode = 'NONE';
    }
}