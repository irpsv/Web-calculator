function isArray(obj) {
    return Object.prototype.toString.call(obj) === Object.prototype.toString.call([]);
}

/**
 * Главный объект калькулятора
 * @type Object
 */
Calculator = {};

/**
 * Число знаков после запятой в выводе
 * @type Number
 */
Calculator.fix = 0;

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
        this.formula().val().toFixed(this.fix)
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
    this.parseValue = function(value) {
        // если Operand
        if (value.val !== undefined) {
            return value.val();
        }
        // если String
        else if (isNaN(value)) {
            var tmp = Calculator.fields[value];
            if (tmp === null) {
                throw new Error("Input value invalid");
            }
            return tmp;
        }
        // если Number
        else {
            return value;
        }
    };
    //
    var __value = this.parseValue(input_value);
    this.val = function() {
        return __value;
    }
}

Operand.prototype.o = function(operator, args)
{
    if (isArray(args)) {
        var result = op(this.val());
        for (var i=0; i<args.length; i++) {
            result = result.calc(operator, args[i]);
        }
        return result;
    }
    return this.calc(operator, args);
};

Operand.prototype.calc = function(operator, arg)
{
    var value = this.parseValue(arg);
    switch (operator) {
        case '+':
            return op(this.val() + value);
        case '-':
            return op(this.val() - value);
        case '/':
            return op(this.val() / value);
        case '*':
            return op(this.val() * value);
        case '^':
            return op(Math.pow(this.val(), value));
        default:
            throw new Error("Operator not found");
    }
};