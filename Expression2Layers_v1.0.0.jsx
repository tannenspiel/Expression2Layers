(function propertyExpressionTool(thisObj) {
    var selectedProperty = null; // Переменная для хранения текущего выделенного свойства
    
    
    
    if (thisObj.propertyExpressionToolWindow && !thisObj.propertyExpressionToolWindow.closed) {
        thisObj.propertyExpressionToolWindow.show(); // Показываем уже открытое окно
        return;
    }

    // Создаем окно пользовательского интерфейса
    var scriptWindow = new Window("palette", "Property Expression Tool", undefined, {resizeable: true});
    scriptWindow.orientation = "column";

    // Поле для ввода выражения
    var expressionGroup = scriptWindow.add("group");
    expressionGroup.orientation = "column";
    expressionGroup.add("statictext", undefined, "Expression Text:");
    var expressionInput = expressionGroup.add("edittext", undefined, "", {multiline: true});
    expressionInput.size = [600, 300];


    var getPropertyButton = scriptWindow.add("button", undefined, "Get Custom Property");
    getPropertyButton.size = [300, 25];
    
    // Листбокс для отображения свойств
    var propertyList = scriptWindow.add("listbox", undefined, ["Position", "Scale", "Rotation", "Opacity", "Anchor Point"]);
    propertyList.size = [300, 150];

    // Кнопки управления
    var buttonGroup = scriptWindow.add("group");
    buttonGroup.orientation = "row";
    
    var writeExpressionButton = buttonGroup.add("button", undefined, "WRITE EXPRESSION to Selected Layers");
    writeExpressionButton.size = [300, 75];
    
    
    scriptWindow.onClose = function () {
        thisObj.propertyExpressionToolWindow = null; // Удаляем ссылку на окно при его закрытии
    };

    thisObj.propertyExpressionToolWindow = scriptWindow; // Сохраняем ссылку на окно
    
    

    scriptWindow.center();
    scriptWindow.show();

    // Обработчик кнопки Get Property
    getPropertyButton.onClick = function () {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert("Выберите композицию.", "Ошибка");
            return;
        }

        // Функция для нахождения самого глубокого выбранного свойства
        function findDeepestSelectedProp() {
            var deepestProp = null, numDeepestProps = 0, deepestPropDepth = 0;
            for (var i = 0; i < comp.selectedProperties.length; i++) {
                var prop = comp.selectedProperties[i];
                if (prop.propertyDepth >= deepestPropDepth) {
                    if (prop.propertyDepth > deepestPropDepth) numDeepestProps = 0;
                    deepestProp = prop;
                    numDeepestProps++;
                    deepestPropDepth = prop.propertyDepth;
                }
            }
            return (numDeepestProps > 1) ? null : deepestProp;
        }

        var prop = findDeepestSelectedProp();
        if (!prop) {
            alert("Выберите одно свойство.", "Ошибка");
            return;
        }

        selectedProperty = prop; // Сохраняем выбранное свойство
        alert("Выбранное свойство: " + prop.name);

        // Обновляем список свойств
        propertyList.removeAll();
        ["Position", "Scale", "Rotation", "Opacity", "Anchor Point"].forEach(function (baseProp) {
            propertyList.add("item", baseProp);
        });
        
        // Добавляем последнее выбранное свойство с префиксом "Custom: "
        propertyList.add("item", "Custom: " + prop.name); 
    };

    // Обработчик кнопки Write Expression
    writeExpressionButton.onClick = function () {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert("Выберите композицию.", "Ошибка");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            alert("Выберите хотя бы один слой.", "Ошибка");
            return;
        }

        var selectedPropertyName = propertyList.selection ? propertyList.selection.text : null;
        if (!selectedPropertyName) {
            alert("Выберите свойство из списка.", "Ошибка");
            return;
        }

        var expressionText = expressionInput.text;

        app.beginUndoGroup("Write Expression");
        var skippedLayers = [];

        selectedLayers.forEach(function (layer) {
            try {
                var property = null;

                // Проверка для базовых трансформаций
                if (selectedPropertyName === "Position" || selectedPropertyName === "Scale" ||
                    selectedPropertyName === "Rotation" || selectedPropertyName === "Opacity" || selectedPropertyName === "Anchor Point") {
                    // Применение к базовым трансформациям
                    property = layer.property(selectedPropertyName);
                } else {
                    // Ищем путь для других свойств
                    property = findPropertyPath(layer, selectedPropertyName);
                }

                if (property && property.canSetExpression) {
                    property.expression = expressionText;
                    $.writeln("Выражение успешно применено к слою: " + layer.name);
                } else {
                    skippedLayers.push(layer.name);
                }
            } catch (error) {
                $.writeln("Ошибка на слое " + layer.name + ": " + error.message);
                skippedLayers.push(layer.name);
            }
        });

        app.endUndoGroup();

        if (skippedLayers.length > 0) {
            alert('Выражение не удалось применить к следующим слоям:\n' + skippedLayers.join("\n"));
        } else {
            alert("Выражение успешно применено.");
        }
    };

    // Функция для нахождения пути к свойству
    function findPropertyPath(layer, propertyName) {
    // Проверяем, что выбранное свойство существует
    if (!selectedProperty) return null;

    var propertyPathArray = [];
    var prop = selectedProperty;

    // Создаём массив с полным путём к свойству
    while (prop) {
        propertyPathArray.unshift(prop.name);
        prop = prop.parentProperty;
    }

    // Убираем имя слоя, если нужно (например, если путь начинается с самого слоя)
    propertyPathArray.shift();

    // Ищем свойство по пути в указанном слое
    var currentProperty = layer;
    for (var i = 0; i < propertyPathArray.length; i++) {
        currentProperty = currentProperty.property(propertyPathArray[i]);
        $.writeln("Проверяем уровень: " + propertyPathArray[i]);

        if (!currentProperty) {
            // Если на каком-то уровне свойство отсутствует, прерываем поиск
            $.writeln("Путь прерван на уровне: " + propertyPathArray[i]);
            return null;
        }        
    }
    return currentProperty;
}



})(this);
