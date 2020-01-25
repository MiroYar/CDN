'use strict';
/*MYGallery ver. 0.0.1a*/

function Gallery(id) {
    /*ФОРМИРОВАНИЕ СЛАЙДЕРА И СОЗДАНИЕ ОСНОВНЫХ ПЕРЕМЕННЫХ===============*/
    /*ПЕРЕМЕННЫЕ*/
    let GALLERY = document.querySelector(id);
    let SLIDER = GALLERY.querySelector('.slider');
    let SLIDER_WRAPPER = SLIDER.querySelector('.slider__wrapper');
    let sliderItemSRCArray = []; //Создание пустого массива с сылками на привью изображения.
    let sliderItemSRCZoomArrey = [];
    let SLIDES_NUM; //Общее количество слайдов в галерее.
    let lastIndex; //Индекс последнего слайда в невидимой области.
    let VIS_FIELD_LENGTH = 1; //Количество слайдов в поле видимости.
    let imgWidth = 550; //Исходная ширина слайда.

    /*ФУНКЦИИ*/
    /*Функция отрисовки слайда, где:
    nextInd - индекс изображения из массива с данными,
    offset - индекс места для слайда от 0 до n, где крайние показатели находятся в невидимой облати*/
    function draw(nextInd, offset) {
        let img = document.createElement('img'); //Создание изображения.
        let sliderItemTranslate = offset * imgWidth - imgWidth; //Расчет его положения в соответсвии с индексом офсета, где нулевой индекс принимает отрицательное значение положения находясь левее за нулевой отметкой первого офсета.
        img.style.transform = 'translate(' + sliderItemTranslate + 'px, 0)'; //Предустановка параметра положения изображения.
        img.src = sliderItemSRCArray[nextInd]; //Предустанока ссылки на изображение.
        img.dataset.srcZoom = sliderItemSRCZoomArrey[nextInd];
        img.onclick = zoom;
        img.classList.add('slider__item'); //Предустановка класса изображения для применения заданного CSS стиля.
        if (offset == 0) {
            SLIDER_WRAPPER.insertBefore(img, SLIDER_WRAPPER.children[0]); //Добавление потомка в начало списка.
        } else {
            SLIDER_WRAPPER.appendChild(img); //Добавление потомка в конец списка.
        }
    }

    /*Функция расчета следующего индекса для отрисовки, где:
    nexIndex - возвращаемое и расчетное значение,
    reverse - булевое значение, означающего в начало списка(true) либо в конец(false) предполагается отрисовывать новый слайд.*/
    function setNextInd(nextInd, reverse) {
        if (reverse == false) {
            if (lastIndex + 1 == SLIDES_NUM) {
                //Проверка является ли текущий индекс из масива последним с учетом понимания, что индекс начинается от нуля, а длина не пустого массива всегда больше нуля.
                nextInd = 0; //Переход в начало массива.
                lastIndex = 0; //Присвоение текущему крайнему отрисованному слайду нового значения.
            } else {
                nextInd = lastIndex + 1; //Переход на одну позицию в большую сторону в массиве.
                lastIndex++; //Присвоение текущему последнему в списке отрисованному слайду нового значения.
            }
        } else {
            if (lastIndex - VIS_FIELD_LENGTH <= 1) {
                nextInd = SLIDES_NUM + lastIndex - (VIS_FIELD_LENGTH + 2); //(VIS_FIELD_LENGTH + 2) - количество отрисованных слайдов, включая скрытых.
                nMin();
            } else {
                nextInd = lastIndex - (VIS_FIELD_LENGTH + 2); //(VIS_FIELD_LENGTH + 2) - количество отрисованных слайдов, включая скрытых.
                nMin();
            }
            /*Функция смещения индекса текущего последнего отрисованного слайда на одну меньшую позицию*/
            function nMin() {
                if (lastIndex == 0) {
                    lastIndex = SLIDES_NUM - 1;
                } else {
                    lastIndex--;
                }
            }
        }
        return nextInd;
    }

    /*Цыкл на перезапись данных изображений в переменные массивов*/
    function setArrayVariables(i) {
        let sliderItemArray = SLIDER.querySelectorAll('.slider__item'); //Создание временного массива с изображениями.
        for (var i = 0; i < sliderItemArray.length; i++) {
            sliderItemSRCArray[i] = sliderItemArray[i].src; //Запись ссылки на изображение в массив.
            sliderItemSRCZoomArrey[i] = sliderItemArray[i].dataset.srcZoom; //Запись ссылки на увеличенное изображение в массив.

            sliderItemArray[i].remove(); //Удаление изображений после записи данных в переменные.
        }
        return i;
    }

    /*Функция предзагрузки первых слайдов на страницу*/
    function presetSlids() {
        SLIDES_NUM = setArrayVariables(0);
        lastIndex = SLIDES_NUM - 2; //Искуственное смещение последнего индекса слайда чтобы первым отрисовался слайд с последним индексом из общего списка.
        for (let i = 0; i < VIS_FIELD_LENGTH + 2; i++) {
            let nextInd = setNextInd(0, false);
            draw(nextInd, i);
        }
    }

    /*ПРЕДУСТАНОВКИ*/
    presetSlids(); //Предзагрузка слайдов для просмотра.

    /*АДАПТИВНОСТЬ СЛАЙДЕРА*/
    /*ПЕРЕМЕННЫЕ*/
    let WH = 570 / 300; //Соотношение ширины и высоты (пропорция).

    /*СОБЫТИЯ*/
    window.addEventListener('resize', galleryResize); //Создание евента при изменении размеров окна браузера для изменения размеров галереи.

    /*ФУНКЦИИ*/
    /*Функция изменения высоты галереи*/
    function galleryResize() {
        GALLERY.style.height = GALLERY.offsetWidth / WH + 'px';
        imgWidth = GALLERY.offsetWidth - 20; //Изменение информации о ширине слайдов для правильного их смещения, где "20" - это значение паддинга слева и права (10+10).
    }

    /*ПРЕДУСТАНОВКИ*/
    galleryResize();

    /*ПЕРЕКЛЮЧЕНИЕ/ПЕРЕМЕЩЕНИЕ СЛАЙДОВ===================================*/
    /*ПЕРЕМЕННЫЕ*/
    let RIGHT_BTN = SLIDER.querySelector('.btnright');
    let LEFT_BTN = SLIDER.querySelector('.btnleft');
    let sliderIsFlip = false; //Булевая переменная, свидетельствующая об исполнении функции перелистывания слайдов влево или вправо.

    /*СОБЫТИЯ*/
    RIGHT_BTN.onclick = sliderItemFlipRight;
    LEFT_BTN.onclick = sliderItemFlipLeft;

    /*ФУНКЦИИ*/
    /*Функция смещения слайдов влево при нажатии кнопки "вправо"
    с удалением первого из двух слайдов оказавшихся в результате смещения в невидимой области слева
    и дорисовки нового слайда в невидимую область справа*/
    function left() {
        sliderIsFlip = true;
        let sliderItemArrayVisible = SLIDER_WRAPPER.querySelectorAll('.slider__item'); //Запись массива из отрисованных слайдов включая в невидидимой области.
        /*Цикл по смещению влево списка слайдов включая слайдов в невидимой области*/
        for (let i = 0; i < sliderItemArrayVisible.length; i++) {
            let sliderItemTranslate = (i - 1) * imgWidth - imgWidth; //|Расчет положения слайда в соответсвии с индексом офсета,
            //------------------------------------------------------|где нулевой индекс принимает отрицательное значение положения находясь левее за нулевой отметкой первого офсета.
            //------------------------------------------------------|(i-1) расчет нового индекса офсета для каждого слайда.
            sliderItemArrayVisible[i].style.transform =
                'translate(' + sliderItemTranslate + 'px, 0)';
        }
        //Ожидание завершения CSS анимации для окончания операции.
        sliderItemArrayVisible[0].addEventListener('transitionend', function() {
            sliderItemArrayVisible[0].remove(); //Удаление лишнего слайда смещенного в положение офсета с индексом "-1".
            let nextInd = setNextInd(0, false);
            draw(nextInd, VIS_FIELD_LENGTH + 1); //Добавление в освободившееся свободное положение офсета в невидимой области справа.
            sliderIsFlip = false;
        });
    }

    /*Функция смещения слайдов вправо при нажатии кнопки "влево"
    с удалением последнего из двух слайдов оказавшихся в результате смещения в невидимой области слева
    и дорисовки нового слайда в невидимую область справа*/
    function right() {
        sliderIsFlip = true;
        let sliderItemArrayVisible = SLIDER_WRAPPER.querySelectorAll('.slider__item');
        /*Цикл по смещению вправо списка слайдов включая слайдов в невидимой области*/
        for (let i = 0; i < sliderItemArrayVisible.length; i++) {
            let sliderItemTranslate = i * imgWidth; //|Расчет положения слайда в соответсвии с индексом офсета,
            //-------------------------------------|где нулевой индекс принимает отрицательное значение положения находясь левее за нулевой отметкой первого офсета.
            //-------------------------------------|Формула расчета "(i+1)*imgWidth - imgWidth", где (i + 1) расчет нового индекса офсета для каждого слайда, принимает приведенный вид.
            sliderItemArrayVisible[i].style.transform =
                'translate(' + sliderItemTranslate + 'px, 0)';
        }
        //Ожидание завершения CSS анимации для окончания операции.
        sliderItemArrayVisible[VIS_FIELD_LENGTH + 1].addEventListener('transitionend', function() {
            sliderItemArrayVisible[VIS_FIELD_LENGTH + 1].remove(); //Удаление лишнего слайда смещенного в положение второго офсета в невидимой области справа.
            let nextInd = setNextInd(0, true);
            draw(nextInd, 0); //Добавление в освободившееся свободное положение офсета с индексом "0".
            sliderIsFlip = false;
        });
    }

    /*Предустановка функционала на кнопку "вправо" для слайдера*/
    function sliderItemFlipRight() {
        if (sliderIsFlip == false) {
            left();
            slideshowRestart();
        }
    }

    /*Предустановка функционала на кнопку "влево" для слайдера*/
    function sliderItemFlipLeft() {
        if (sliderIsFlip == false) {
            right();
            slideshowRestart();
        }
    }

    /*ПРСМОТР ИЗОБРАЖЕНИЙ В БОЛЬШЕМ МАСШТАБЕ=============================*/
    /*ПЕРЕМЕННЫЕ*/
    let POPUP = GALLERY.querySelector('.popup');
    let CLOSE_BTN = POPUP.querySelector('.closebtn');
    let SLIDESHOW_BTN = POPUP.querySelector('.slideshowbtn');
    let LEFT_BTNPOPUP = POPUP.querySelector('.btnleft');
    let RIGHT_BTNPOPUP = POPUP.querySelector('.btnright');
    let GALLERY_BUBBLESPANEL = {};

    /*СОБЫТИЯ*/
    CLOSE_BTN.onclick = closeZoom;
    SLIDESHOW_BTN.onclick = slideshowInputToggle;
    LEFT_BTNPOPUP.onclick = popupPictureFlipLeft;
    RIGHT_BTNPOPUP.onclick = popupPictureFlipRight;

    /*ФУНКЦИИ*/
    /*Функция включения модального окна с увеличенным изображением.*/
    function zoom() {
        POPUP.style.display = 'grid';
        GALLERY_BUBBLESPANEL = new BubblesPanel(`.gallery${id.replace(/\D/g, '')}__bubblepanel`);
        let srcZoom = this.dataset.srcZoom;
        let imgZoom = POPUP.querySelector('.popup__imgzoom');
        imgZoom.src = srcZoom;
        if (slideshow != null) {
            clearTimeout(slideshow);
        }
    }

    /*Функция закрытия модального окна с увеличенным изображением.*/
    function closeZoom() {
        POPUP.style.display = 'none';
        GALLERY_BUBBLESPANEL = null;
        let imgZoom = POPUP.querySelector('.popup__imgzoom');
        imgZoom.src = '#';
        if (slideshow != null) {
            slideshowToggle();
        }
    }

    /*Функция включения/отключения инпута слайдшоу с соответсвующим действием слайдшоу*/
    function slideshowInputToggle() {
        if (SLIDESHOW_INPUT.checked) {
            SLIDESHOW_INPUT.checked = false;
        } else {
            SLIDESHOW_INPUT.checked = true;
        }
        slideshowToggle();
    }

    /*Функция перелистывания увеличенных изображений вправо*/
    function popupPictureFlipRight() {
        let imgZoom = POPUP.querySelector('.popup__imgzoom');
        let imgZoomSRC = imgZoom.src;
        let ind = sliderItemSRCZoomArrey.indexOf(imgZoomSRC);
        if (ind + 1 == SLIDES_NUM) {
            ind = 0;
        } else {
            ind++;
        }
        imgZoom.src = sliderItemSRCZoomArrey[ind];
    }

    /*Функция перелистывания увеличенных изображений влево*/
    function popupPictureFlipLeft() {
        let imgZoom = POPUP.querySelector('.popup__imgzoom');
        let imgZoomSRC = imgZoom.src;
        let ind = sliderItemSRCZoomArrey.indexOf(imgZoomSRC);
        if (ind == 0) {
            ind = SLIDES_NUM - 1;
        } else {
            ind--;
        }
        imgZoom.src = sliderItemSRCZoomArrey[ind];
    }

    /*СЛАЙДШОУ===========================================================*/
    /*ПЕРЕМЕННЫЕ*/
    let SLIDESHOW_INPUT = SLIDER.querySelector('.slideshow'); //Инпут для включения опции слайдшоу.
    let slideshow = null; //Таймер для слайдшоу.
    let slideshowTime = 5000; //

    /*СОБЫТИЯ*/
    SLIDESHOW_INPUT.oninput = slideshowToggle; //Cобытие включения/выключения чекбокса слайдшоу.

    /*ФУНКЦИИ*/
    /*Функция на событие включения/выключения чекбокса слайдшоу.*/
    function slideshowToggle() {
        if (SLIDESHOW_INPUT.checked) {
            slideshow = setTimeout(function tick() {
                //Включение интервального таймера для слайдшоу.
                left();
                slideshow = setTimeout(tick, slideshowTime);
            }, slideshowTime);
            SLIDESHOW_BTN.classList.add('slideshowbtn-stop');
        } else {
            clearTimeout(slideshow); //Выключение интервального таймера для слайдшоу.
            slideshow = null; //Обнуление значения таймера для возможной дальнейшей проверки на существование.
            SLIDESHOW_BTN.classList.remove('slideshowbtn-stop');
        }
    }

    /*Функция рестарта таймера для слайдшоу*/
    function slideshowRestart() {
        if (slideshow != null) {
            clearTimeout(slideshow);
            slideshowToggle();
        }
    }

    /*ПРЕДУСТАНОВКИ*/
    slideshowToggle(); //Проверка на наличие включенного слайдшоу по умолчанию.
}
