class Scrolled {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.right = getComputedStyle(this.element).paddingRight;
    }

    _scrollOverflow() {
        let style = this.element.style;
        let overflow = style.overflow || getComputedStyle(this.element).overflow;
        if (overflow !== 'scroll') {
            style.paddingRight = '0px';
            style.overflow = 'scroll';
        }
    }

    _hiddenOverflow() {
        let style = this.element.style;
        let overflow = style.overflow || getComputedStyle(this.element).overflow;
        if (overflow === 'scroll') {
            style.paddingRight = this.right || '0px';
            style.overflow = 'hidden';
        }
    }

    init() {
        this.element.addEventListener('mouseover', this._scrollOverflow.bind(this));
        this.element.addEventListener('touchstart', this._scrollOverflow.bind(this));
        this.element.addEventListener('mouseout', this._hiddenOverflow.bind(this));
        this.element.addEventListener('touchend', this._hiddenOverflow.bind(this));
    }
}
