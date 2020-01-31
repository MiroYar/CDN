module.exports = function cColor(text, flag) {
    const n1 = { 2: 3, 3: 9 };
    const n2 = { D: 0, R: 1, G: 2, Y: 3, B: 4, M: 5, C: 6, W: 7 };

    function _num(f) {
        return `${n1[f.length] + (f[0] === 'B')}${n2[f[1]]}`;
    }

    function _code(f) {
        return `\x1b[${_num(f.toUpperCase())}m`;
    }

    let code;

    if (typeof flag === 'string' && flag !== '') code = _code(flag);
    else if (typeof flag === 'object') {
        for (const f1 in flag) {
            code = `${code || ''}${_code(`${f1}${flag[f1]}`)}`;
        }
    }

    return code ? `${code}${text}\x1b[0m` : text;
};
