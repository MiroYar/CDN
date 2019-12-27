// Разделитель числа. Возвращает массив.
function numSeparator(
    num, // ----------------- Разделяемое число;
    {
        separ = 3, // ------- Диапазон разделения;
        reverse = true, // -- Разделение с конца числа (не меняет порядок цифр в строке);
        toString = true // -- Вернуть в виде массива строк, иначе в виде массива чисел.
    } = {}
) {
    num = String(num).replace(/\D/g, '');
    let lim = num.length;
    let n1 = 0;
    let n2 = reverse ? lim % separ : separ;
    let cond = true;
    let arr = [];
    while (cond) {
        cond = n2 < lim;
        let result = num.slice(n1, n2);
        if (result) arr.push(toString ? result : Number(result));
        n1 = n2;
        n2 = n2 + separ;
    }
    return arr;
}
