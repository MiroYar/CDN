class Scrolled {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.right = getComputedStyle(this.element).paddingRight;
    }

    scrollOverflow() {
        let style = this.element.style;
        let overflow = style.overflow || getComputedStyle(this.element).overflow;
        if (overflow !== 'scroll') {
            style.paddingRight = '0px';
            style.overflow = 'scroll';
        }
    }

    hiddenOverflow() {
        let style = this.element.style;
        let overflow = style.overflow || getComputedStyle(this.element).overflow;
        if (overflow === 'scroll') {
            style.paddingRight = this.right || '0px';
            style.overflow = 'hidden';
        }
    }

    init() {
        this.element.addEventListener('mouseover', this.scrollOverflow.bind(this));
        this.element.addEventListener('touchstart', this.scrollOverflow.bind(this));
        this.element.addEventListener('mouseout', this.hiddenOverflow.bind(this));
        this.element.addEventListener('touchend', this.hiddenOverflow.bind(this));
    }
}
