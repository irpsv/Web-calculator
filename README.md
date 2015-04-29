#Web-calculator

Библиотека представлет собой инструмент для встраивания на веб-страницу виджета **калькулятор**

##Описание

###Поля

Все элементы калькулятора - это HTML теги (**input** или **select**), с указанным атрибуттом **data-calc**.

Например:
```html
<div data-calc="MAIN">
	<!-- поля калькулятора -->
	<div>
		<input data-calc="field1">
		<input data-calc="field2">
		...
		<input data-calc="fieldN">
	</div>
	<!-- вывод результата -->
	<div>
		<input data-calc="OUTPUT">
	</div>
	<!-- кнопка начала вычислений -->
	<div>
		<input type='button' onclick='Calculator.exec()'>
	</div>
</div>
```
где *field1, field2, ...* - имена полей калькулятора.

На имена полей накладываются ограничения:
- не число (допустимы имена вида: "1a", "x3", ...)
- не [ключевое слово](#Ключевые-слова) ("MAIN" или "OUTPUT")

Последним полем является кнопка при нажатии на которую происходит вычисление по указанной [формуле](#Формула).

###Формула

Для того чтобы калькулятор знал каким образом производить вычисления, необходимо перегрузить метод **formula** в главном объекте.

Например:
```javascript
Calculator.formula = function() {
	
}
```

###Ключевые слова

Всего их два и предназначены они для служебных целей (регистр ВАЖЕН):
- **MAIN** - определяет области калькулятора, среди потомков данного тега производиться поиск [полей калькулятора](#Поля).
- **OUTPUT** - определяет куда будет выводиться результат вычислений. Может быть любым тегом имеющим свойства **value** или **innerHTML**. Данный тег можно не указывать, тогда результат будет отображен в сплывающем окне **alert**.
