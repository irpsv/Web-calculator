/**
 * Главный объект калькулятора
 * @type Object
 */
Calculator = {};

/**
 * Элемент вывода в который будет возвращено значение
 */
Calculator.output = null;

/**
 * Список правил для полей калькулятора
 * @type {Object}
 */
Calculator.rules = {};

/**
 * Список полей калькулятора
 */
Calculator.fields = [];

/**
 * Функция которая вызывается после проведения вычислений
 */
Calculator.afterExec = function() {};

/**
 * По умолчанию формула возвращает 0
 */
Calculator.formula = function() {
    return new Operand(0);
};

/**
 * Выполняет вычисления по указанной формуле и вывод результат в поле вывода, либо через alert
 */
Calculator.exec = function() {
    this.initFields();
    this.checkRules();
    this.printOutput(
        this.formula().value
    );
    this.afterExec();
};

/**
 * Выводит на страницу (либо в ALERT сообщении) результаты вычислений
 * @param {Number} val
 */
Calculator.printOutput = function(val) {
    if (this.output === null) {
        alert(val);
    }
    else {
        if (this.output.value === undefined)
            this.output.innerHTML = val;
        else
            this.output.value = val;
    }
};

/**
 * Поиск главного тега MAIN
 * @returns {Element}
 */
Calculator.findMainTag = function() {
    var all = document.body.getElementsByTagName("*");
    for (var i = 0; i < all.length; i++) {
        if (all[i].getAttribute("data-calc") === "MAIN") {
            return all[i];
        }
    }
    return null;
};

/**
 * Инициализирует значения полей
 */
Calculator.initFields = function() {
    var items = this.findMainTag().getElementsByTagName("*");
    for (var i = 0; i < items.length; i++) {
        var name = null;
        var elem = items[i];
        if ((name = elem.getAttribute("data-calc")) !== null) {
            if (name === "OUTPUT")
                this.output = elem;
            else
                this.fields[name] = Number(elem.value);
        }
    }
};

/**
 * Проверка правил установленных пользователем
 */
Calculator.checkRules = function() {
    for (var name in this.rules) {
        var rule = this.rules[name];
        this.fields[name] = rule(this.fields[name]);
    }
};

/**
 * Мини-конструктор
 * @returns {Operand}
 */
function op(value) {
    return new Operand(value);
}

/**
 * Объект представляющий операнда калькулятора
 * @param {Number|String|Operand} input_value числовое значение, или же имя атрибута калькулятора
 */
function Operand(input_value) {
    this.getValue = function(val) {
        // если Operand
        if (val.value !== undefined) {
            return val.value;
        }
        // если String
        else if (isNaN(val)) {
            var tmp = Calculator.fields[val];
            if (tmp === null) {
                throw new Error("Input value invalid");
            }
            return tmp;
        }
        // если Number
        else {
            return val;
        }
    };
    this.value = this.getValue(input_value);
}

/**
 * ОПЕРАЦИИ МЕЖДУ ДВУМЯ ОПЕРАНДАМИ
 */

Operand.prototype.add = function(value) {
    return op(this.value + this.getValue(value));
}

Operand.prototype.sub = function(value) {
    return op(this.value - this.getValue(value));
}

Operand.prototype.multy = function(value) {
    return op(this.value * this.getValue(value));
}

Operand.prototype.div = function(value) {
    return op(this.value / this.getValue(value));
}

Operand.prototype.pow = function(value) {
    return op(Math.pow(this.value, this.getValue(value)));
}

/**
 * ОПЕРАЦИИ НАД НЕСКОЛЬКИМИ ОПЕРАНДАМИ
 */

Operand.sum = function(values) {
    var result = new Operand(0);
    for (var i = 0; i < values.length; i++) {
        result = result.add(values[i]);
    }
    return result;
}

Operand.multymany = function (values) {
    var result = new Operand(1);
    for (var i = 0; i < values.length; i++) {
        result = result.multy(values[i]);
    }
    return result;
}