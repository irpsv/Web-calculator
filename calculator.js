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
 * Тэг формы из которой нужно брать данные
 */
Calculator.id_main_elem = null;

/**
 * Тэг формы в которую будет выводиться результат
 */
Calculator.id_output_elem = null;

/**
 * Список правил для полей калькулятора
 * @type {Object}
 */
Calculator.rules = {};

/**
 * Список полей калькулятора
 */
Calculator.fields = {};

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
    Calculator.initFields();
    Calculator.checkRules();
    Calculator.printOutput(
        Calculator.formula().val().toFixed(Calculator.fix)
    );
    Calculator.afterExec();
};

/**
 * Выводит на страницу (либо в ALERT сообщении) результаты вычислений
 * @param {Number} val
 */
Calculator.printOutput = function(val) {
    var output = document.getElementById(Calculator.id_output_elem);
    if (output === null) {
        alert(val);
    }
    else if (output.value === undefined) {
        output.innerHTML = val;
    }
    else {
        output.value = val;
    }
};

/**
 * Поиск главного тега MAIN
 * @returns {Element}
 */
Calculator.findMainTag = function() {
    return document.getElementById(Calculator.id_main_elem);
};

/**
 * Инициализирует значения полей
 */
Calculator.initFields = function() {
    var main_dom = Calculator.findMainTag();
    Calculator.initFieldsForArray(
        main_dom.getElementsByTagName("input")
    );
    Calculator.initFieldsForArray(
        main_dom.getElementsByTagName("select")
    );
};

Calculator.initFieldsForArray = function(items) {
    for (var i = 0; i < items.length; i++) {
        var elem = items[i];
        if  (elem.name != "" && elem.id != Calculator.id_output_elem) {
            if (isNaN(elem.value) || !elem.checked && (elem.type == 'radio' || elem.type == 'checkbox')) {
                continue;
            }
            Calculator.fields[elem.name] = Number(elem.value);
        }
    }
}

/**
 * Проверка правил установленных пользователем
 */
Calculator.checkRules = function() {
    for (var name in this.rules) {
        var rule = this.rules[name];
        Calculator.fields[name] = rule(Calculator.fields[name]);
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
        if (value.hasOwnProperty('val')) {
            return value.val();
        }
        // если String
        else if (isNaN(value)) {
            var tmp = Calculator.fields[value];
            if (tmp === null || tmp === undefined) {
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
