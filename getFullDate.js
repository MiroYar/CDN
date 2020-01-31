function getFullDate(date, { reverse = false, monthFirst = false, join = ' ', language } = {}) {
    const month = {
        ru: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ]
    };

    const dateMethod = ['getDate', 'getMonth', 'getFullYear'];
    if (reverse) dateMethod.reverse();
    else if (monthFirst) dateMethod.reverse().push(dateMethod.shift());
    // let year = dateMethod.pop(); dateMethod.reverse().push(year); - второй вариант
    // перемещения метода 'getMonth' из списка на первое место, может оказаться предпочтительнее
    // по производительности, т.к. метод pop() быстрее shift().

    return dateMethod
        .reduce((result, method) => {
            let value = date[method]();

            if (method === 'getMonth' && language) value = month[language][value];
            else if (String(value).length < 2) value = '0' + value;

            result.push(value);

            return result;
        }, [])
        .join(join);
}
