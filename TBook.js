const cColor = require('./cColor.js');

class TBook {
    constructor({ debug = false } = {}) {
        this.tasks = {};
        this.debug = debug;
    }

    _time(date) {
        return String(date).match(/\d{2}:\d{2}:\d{2}/);
    }

    _id(num, { length = 5, pref = '' } = {}) {
        let id = String(num);
        const diff = length - id.length;
        for (let i = 0; i < diff; i++) {
            pref = `${pref}0`;
        }
        return `${pref}${num}`;
    }

    _digitID(num, first = 0) {
        return num ? Number(num.replace(/\D/g, '')) + 1 : first;
    }

    async _todo(name, yarn) {
        let task = this.tasks[name];
        task.started = new Date();
        const id = this._id(this._digitID(task.id), { length: 3, pref: '#' });
        task.id = id;
        if (this.debug)
            console.log(
                `[${cColor(this._time(task.started), 'FDB')}] ${cColor(
                    `${id}`,
                    'FC'
                )} ${name} ${cColor('Started', 'FCB')}`
            );
        task.isRun = true;
        yarn = await this._fn(yarn, name);
        task.finished = new Date();
        if (this.debug)
            console.log(
                `[${cColor(this._time(task.finished), 'FDB')}] ${cColor(
                    `${id}`,
                    'FC'
                )} ${name} ${cColor('Finished', 'FBB')}`
            );
        task.isRun = false;
        return yarn;
    }

    _fn(yarn, name) {
        return new Promise(entry => {
            this.tasks[name].fn(entry, yarn, name);
        });
    }

    task(name, fn) {
        if (typeof fn === 'function') this.tasks[name] = { fn };
    }

    lastRun(name) {
        return this.tasks[name].started;
    }

    isRun(name) {
        return this.tasks[name].isRun;
    }

    run(task, yarn) {
        switch (typeof task) {
            case 'string':
                return this._todo(task, yarn);

            case 'object':
                switch (task.type) {
                    case 'parallel':
                        return Promise.all(task.tasks.map(this.run.bind(this)));

                    case 'series':
                        let tie = this.run.bind(this)(task.tasks[0]);
                        const length = task.tasks.length;
                        for (let i = 1; i < length; i++) {
                            const taskName = task.tasks[i];
                            tie = tie.then(yarn => this.run.bind(this)(taskName, yarn));
                        }
                        return tie;
                }
        }
    }

    parallel(...tasks) {
        return { type: 'parallel', tasks };
    }

    series(...tasks) {
        return { type: 'series', tasks };
    }
}

const tB = new TBook({ debug: true });

tB.task('message', entry => {
    setTimeout(() => {
        entry();
    }, 3000);
});

tB.task('show:message', entry => {
    tB.run('message').then(entry);
});

tB.task('create', entry => {
    setTimeout(() => {
        let count = 0;
        entry(count);
    }, 1000);
});

tB.task('count', (entry, count) => {
    setTimeout(() => {
        count++;
        entry(count);
    }, 1000);
});

tB.task('write', (entry, count) => {
    setTimeout(() => {
        console.log(count);
        entry(count);
    }, 1000);
});

tB.run(
    tB.parallel(
        tB.series('create', 'count', 'count', 'count', 'write'),
        tB.series('create', 'count', 'count', 'count', 'count', 'write')
    )
).then(result => console.log(result));
