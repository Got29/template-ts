import './index.css';
import './animate.css';
import './watch/watch.svg';
import {UpgradedWatch, Watch} from "./watch/watch";

const watch1: Watch = new Watch("mainContainer");
watch1.start()

const addWatchBtn: HTMLElement = document.getElementById("addWatchButton");
const animateWatchBtn: HTMLElement = document.getElementById("animateWatchButton");
addWatchBtn.addEventListener('click', () => {
    const mainContainer: HTMLElement = document.getElementById("mainContainer");
    const template: HTMLTemplateElement = document.getElementById("addWatchFormTemplate") as HTMLTemplateElement;
    const form: HTMLElement = template.content.cloneNode(true) as HTMLElement;
    mainContainer.appendChild(form);

    const validateFormBtn: HTMLElement = document.getElementById("validateFormBtn");
    const cancelFormBtn: HTMLElement = document.getElementById("cancelFormBtn");
    validateFormBtn.addEventListener('click', onValidate)
    cancelFormBtn.addEventListener('click', onCancel)
});

const animationClasses: string[] = ["watchRotate", "watchScaleUp", "watchScaleDown"];
animateWatchBtn.addEventListener('click', () => {
    const mainContainer: HTMLElement = document.getElementById("mainContainer");
    const watchesContainer: NodeListOf<HTMLElement> = mainContainer.querySelectorAll(".watchContainer");
    const randomWatch: HTMLElement = watchesContainer[Math.floor(Math.random() * watchesContainer.length)];
    const randomAnimation: string = animationClasses[Math.floor(Math.random() * animationClasses.length)];
    animationClasses.forEach((c: string) => randomWatch.classList.remove(c));
    randomWatch.offsetWidth; // Force trigger animation
    randomWatch.classList.add(randomAnimation);
});

const removeForm = () => {
    const watchForm: HTMLElement = document.getElementById("addWatchForm");
    watchForm.remove();
}

const onValidate = () => {
    const inputField: HTMLInputElement = document.getElementById("addWatchField") as HTMLInputElement;
    const timeZone: number = parseInt(inputField.value, 10) || 0;
    const newWatch: UpgradedWatch = new UpgradedWatch("mainContainer", timeZone);
    newWatch.start()
    removeForm();
}

const onCancel = () => {
    removeForm();
}







