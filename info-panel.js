class InfoPanel {
    constructor(
        selector, // Предпочтительно указывать название класса (с точкой) панели, либо название ID
        // (с решоткой) панели, тогда предпочтительно чтобы названия класса и ID совпадали, либо
        // обязательно название класса указывать в опциях (третий параметр) в виде:
        // {classSelector: <название класса>}.
        data, // Массив из объектов, представлющих собой объекты, у которых key является частью
        // названия класса элемента панели (<название класса панели>__<key>), а value - значение
        // в зависиомоти от типа элемента (для img - ссылка на изображение, для p - текст, и т.д.).
        {
            // Опции.
            BEM = true,
            updatedElem = { img: ['img'], text: ['comment-wrap'] },
            updatedAttr = { img: 'src', text: 'textContent' },
            checkedMod, // Набор названий классовых CSS модификаторов (см. ниже).
            animMod,
            classSelector // Название класса панели без точки (см. выше).
        } = {}
    ) {
        // Название класса информационной панели.
        this._selector = classSelector || selector.slice(1);
        // Основной блок в DOM.
        this._panel = document.querySelector(`${selector}`);
        // Персонализированный набор данных.
        this._data = data;
        // Объект соодержащий список елементов с обновляемой информацией разбитых по типам (img -
        // изображения, text - текстовый), имеет вид:
        // {
        //     <тип>: [
        //         {
        //             element: <ссылка на элемент в DOM>,
        //             elemClass: <имя класса элемента>
        //         },
        //         ...
        //     ],
        //     ...
        // }
        this.BEM = BEM;
        this._updatedElem = this._getUpdatedElements.bind(this)(updatedElem);
        // Обновляемые атрибуты по умолчанию у img - src, у text - textContent.
        this._updatedAttr = updatedAttr;
        // Массив выбранных навигационных элементов, где певым указан индекс ранее выбранного
        // элемента, а вторым - индекс текущего.
        this._checkedInd;
        // Возможный набор названий классовых CSS модификаторов в зависимости от индекса выбранного
        // навигационнго элемента применяемого как непосредственно к выбранному элементу, так и к
        // панели в целом. CSS названия классов принимает вид (подставьте свои названия
        // вместо <...>): для панели - <название класса панели>_<название модификации>,
        // для навигационного элемента - <название класса панели>__nav-item_<название модификации>
        this._checkedMod = typeof checkedMod === 'string' ? [checkedMod] : checkedMod;
        // Объект у которого key - название класса, а value - название анимирующего модификатора.
        this._animMod = animMod;
        this._animElem = this._getAnimatedElements.bind(this)(Object.keys(this._animMod));
        // Массив из элементов навигационной панели.
        this._navItems = this._constructNavItems(
            this._panel.querySelector(`.${this._selector}__nav`)
        );
    }

    _getUpdatedElements(updatedElem) {
        for (const type in updatedElem) {
            updatedElem[type] = updatedElem[type].map(elemClass => {
                return {
                    element: this._panel.querySelector(
                        this.BEM ? `.${this._selector}__${elemClass}` : `${elemClass}`
                    ),
                    elemClass
                };
            });
        }
        return updatedElem;
    }

    _getAnimatedElements(animElem) {
        return animElem.reduce((result, elemClass) => {
            result[elemClass] = this._panel.querySelector(
                this.BEM ? `.${this._selector}__${elemClass}` : `${elemClass}`
            );
            return result;
        }, {});
    }

    _constructNavItems(parent) {
        const navItems = [];
        for (let i = this._data.length; i > 0; i--) {
            const navItem = document.createElement('div');
            const props = { className: this.BEM ? `${this._selector}__nav-item` : '' };
            Object.keys(props).forEach(key => (navItem[key] = props[key]));
            parent.appendChild(navItem);
            navItems.push(navItem);
        }
        return navItems;
    }

    init(ind = 0) {
        // Инициализация
        this._checkedInd = [null, ind];
        this._checkedNavItem({ target: this._navItems[ind] });
        this._updateInformation({ ind });

        // Добавление слушителя событий.
        this._navItems.forEach(navItem => {
            navItem.addEventListener(
                'mousedown',
                this._mousedownEventForNavItems.bind(this, this._checkedNavItem)
            );
        });
    }

    _toggleAnimatingClasses(action) {
        for (const elemClass in this._animElem) {
            this._animElem[elemClass].classList[action](
                this.BEM
                    ? `${this._selector}__${elemClass}_${this._animMod[elemClass]}`
                    : `${this._animMod[elemClass]}`
            );
        }
    }

    _mousedownEventForNavItems(handler, event) {
        handler.bind(this)(event);
        if (this._animMod) {
            this._panel.addEventListener(
                'transitionend',
                this._transitionEndEventForComment.bind(this, this._updateInformation.bind(this)),
                { once: true }
            );
            // Добавление трансформирующих классов к элементам.
            this._toggleAnimatingClasses.bind(this)('add');
        } else {
            this._updateInformation.bind(this)();
        }
    }

    _transitionEndEventForComment(handler, event) {
        handler.bind(this)();
        // Удаление трансформирующих классов у элементов.
        this._toggleAnimatingClasses.bind(this)('remove');
    }

    _toggleCheckedNavItemClass(action, itemInd) {
        this._navItems[itemInd].classList[action](`${this._selector}__nav-item_checked`);
        // Изменение модификатора класса выбранного навигационного элемента.
        if (this._checkedMod) {
            this._navItems[itemInd].classList[action](
                this.BEM
                    ? `${this._selector}__nav-item_${
                          this._checkedMod[itemInd % this._checkedMod.length]
                      }`
                    : `${this._checkedMod[itemInd % this._checkedMod.length]}`
            );
        }
    }

    _checkedNavItem(event) {
        const indPrev = (this._checkedInd[0] = this._checkedInd[1]);
        const indCurr = (this._checkedInd[1] = this._navItems.indexOf(event.target));
        // Изменение класса выбранного навигационного элемента.
        this._toggleCheckedNavItemClass('remove', indPrev);
        this._toggleCheckedNavItemClass('add', indCurr);
    }

    _togglePanelModClass(action, itemInd) {
        this._panel.classList[action](
            `${this._selector}_${this._checkedMod[itemInd % this._checkedMod.length]}`
        );
    }

    _updateInformation() {
        // Изменение модификатора класса информационной панели.
        if (this._checkedMod) {
            this._togglePanelModClass.bind(this)('remove', this._checkedInd[0]);
            this._togglePanelModClass.bind(this)('add', this._checkedInd[1]);
        }
        // Обновление информации на панеле.
        let data = this._data[this._checkedInd[1]];
        for (const type in this._updatedElem) {
            this._updatedElem[type].forEach(elementObj => {
                const attr = this._updatedAttr[type];
                elementObj['element'][attr] = data[elementObj['elemClass']];
            });
        }
    }
}
