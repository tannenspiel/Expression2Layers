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
    buttonGroup.orientation = "column";
    
    var writeExpressionButton = buttonGroup.add("button", undefined, "WRITE EXPRESSION to Selected Layers");
    writeExpressionButton.size = [300, 75];
    
    var clearAllExpressionsButton = buttonGroup.add("button", undefined, "CLEAR ALL EXPRESSIONS from Selected Layers");
    clearAllExpressionsButton.size = [300, 50];
    
    
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
        var baseProps = ["Position", "Scale", "Rotation", "Opacity", "Anchor Point"];
        for (var i = 0; i < baseProps.length; i++) {
            propertyList.add("item", baseProps[i]);
        }
        
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
        var trimmedExpression = expressionText.trim(); // Удаляем пробелы в начале и конце

        // Проверка "пустоты" выражения (пробелы, табы, переносы)
        if (!trimmedExpression) {
            var shouldClear = confirm(
                "Выражение пустое или содержит только пробелы.\n\n" +
                "ОК - УДАЛИТЬ все существующие выражения у выбранных слоев\n" +
                "     (очистит выражения, которые уже были установлены)\n\n" +
                "Отмена - оставить все выражения без изменений"
            );
            if (!shouldClear) {
                return; // Пользователь отменил - ничего не делаем
            }
            // Если ОК - продолжаем с пустой строкой, что очистит выражения
        }

        app.beginUndoGroup("Write Expression");
        var skippedLayers = [];
        var applyToAllDecision = null; // null = не решено, true = применять ко всем, false = пропускать все
        var shouldAbort = false; // Флаг для прерывания операции
        
        // Кэш для хранения старых выражений перед применением новых
        // Структура: cache[layerIndex][propertyPath] = {expression: "...", hasExpression: true/false}
        var expressionsCache = [];
        
        // ПЕРВЫЙ ЦИКЛ: Сохраняем все существующие выражения в кэш
        $.writeln("=== ПЕРВЫЙ ЦИКЛ: Сохранение существующих выражений ===");
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            expressionsCache[i] = {};
            
            try {
                var property = null;
                var pathResult = null;

                // Проверка для базовых трансформаций
                if (selectedPropertyName === "Position" || selectedPropertyName === "Scale" ||
                    selectedPropertyName === "Rotation" || selectedPropertyName === "Opacity" || selectedPropertyName === "Anchor Point") {
                    property = layer.property(selectedPropertyName);
                } else {
                    // Ищем путь для других свойств
                    pathResult = findPropertyPath(layer, selectedPropertyName);
                    if (pathResult) {
                        property = pathResult.property;
                    }
                }

                if (property && property.canSetExpression) {
                    // Сохраняем текущее выражение (если есть)
                    var currentExpression = property.expression;
                    var hasExpression = (currentExpression && currentExpression.length > 0);
                    expressionsCache[i][selectedPropertyName] = {
                        expression: hasExpression ? currentExpression : "",
                        hasExpression: hasExpression
                    };
                    $.writeln("Сохранено выражение для слоя " + layer.name + ": " + (hasExpression ? "есть" : "нет"));
                } else {
                    expressionsCache[i][selectedPropertyName] = {
                        expression: "",
                        hasExpression: false
                    };
                    $.writeln("Свойство не найдено или не поддерживает выражения для слоя: " + layer.name);
                }
            } catch (error) {
                $.writeln("Ошибка при сохранении выражения для слоя " + layer.name + ": " + error.message);
                expressionsCache[i][selectedPropertyName] = {
                    expression: "",
                    hasExpression: false
                };
            }
        }
        
        // ВТОРОЙ ЦИКЛ: Применяем новые выражения
        $.writeln("=== ВТОРОЙ ЦИКЛ: Применение новых выражений ===");
        for (var i = 0; i < selectedLayers.length; i++) {
            // Проверяем, не была ли операция прервана
            if (shouldAbort) {
                $.writeln("Операция прервана пользователем");
                break;
            }
            var layer = selectedLayers[i];
            try {
                var property = null;
                var pathResult = null;

                // Проверка для базовых трансформаций
                if (selectedPropertyName === "Position" || selectedPropertyName === "Scale" ||
                    selectedPropertyName === "Rotation" || selectedPropertyName === "Opacity" || selectedPropertyName === "Anchor Point") {
                    // Применение к базовым трансформациям
                    property = layer.property(selectedPropertyName);
                } else {
                    // Ищем путь для других свойств
                    $.writeln(">>> Обработка слоя: " + layer.name);
                    pathResult = findPropertyPath(layer, selectedPropertyName);
                    if (pathResult) {
                        $.writeln("pathResult получен:");
                        $.writeln("  - hasMismatch: " + pathResult.hasMismatch);
                        $.writeln("  - mismatchInfo: " + pathResult.mismatchInfo);
                        $.writeln("  - originalPath: " + pathResult.originalPath.join(" -> "));
                        $.writeln("  - foundPath: " + pathResult.foundPath.join(" -> "));
                        
                        property = pathResult.property;
                        
                        // Проверяем несовпадения пути
                        if (pathResult.hasMismatch) {
                            $.writeln("!!! ОБНАРУЖЕНО НЕСОВПАДЕНИЕ - показываем диалог");
                            // Если решение уже принято для всех остальных
                            if (applyToAllDecision !== null) {
                                $.writeln("Решение уже принято: " + applyToAllDecision);
                                if (!applyToAllDecision) {
                                    // Пропускаем этот слой
                                    skippedLayers.push(layer.name + " (пропущен из-за несовпадения)");
                                    continue;
                                }
                                // Применяем к этому слою (решение уже принято)
                            } else {
                                // Показываем диалог
                                var hasMoreLayers = (i < selectedLayers.length - 1);
                                $.writeln("Показываем диалог. Есть еще слои: " + hasMoreLayers);
                                var dialogResult = showMismatchDialog(
                                    layer.name,
                                    pathResult.mismatchInfo,
                                    pathResult.originalPath,
                                    pathResult.foundPath,
                                    hasMoreLayers
                                );
                                
                                $.writeln("Результат диалога: apply=" + dialogResult.apply + ", applyToAll=" + dialogResult.applyToAll + ", abort=" + dialogResult.abort);
                                
                                // Если пользователь решил отменить всю операцию
                                if (dialogResult.abort) {
                                    shouldAbort = true;
                                    $.writeln("Пользователь отменил операцию");
                                    break;
                                }
                                
                                // Если пользователь выбрал применить ко всем остальным
                                if (dialogResult.applyToAll) {
                                    applyToAllDecision = dialogResult.apply;
                                    $.writeln("Установлено applyToAllDecision: " + applyToAllDecision);
                                }
                                
                                // Если пользователь решил не применять
                                if (!dialogResult.apply) {
                                    skippedLayers.push(layer.name + " (пропущен из-за несовпадения)");
                                    continue;
                                }
                                // Если применить - продолжаем выполнение ниже
                            }
                        } else {
                            $.writeln("Несовпадений не обнаружено - применяем выражение напрямую");
                        }
                    }
                }

                if (property && property.canSetExpression) {
                    // Применяем trimmedExpression (или пустую строку для очистки)
                    property.expression = trimmedExpression;
                    $.writeln(trimmedExpression ? 
                        "Выражение применено к слою: " + layer.name : 
                        "Выражение очищено на слое: " + layer.name
                    );
                } else {
                    skippedLayers.push(layer.name);
                }
            } catch (error) {
                $.writeln("Ошибка на слое " + layer.name + ": " + error.message);
                skippedLayers.push(layer.name);
            }
        }

        // Если операция была прервана, восстанавливаем все выражения из кэша
        if (shouldAbort) {
            $.writeln("=== ОТМЕНА: Восстановление выражений из кэша ===");
            
            // Восстанавливаем выражения для всех уже обработанных слоев
            for (var restoreIndex = 0; restoreIndex < i && restoreIndex < expressionsCache.length; restoreIndex++) {
                var restoreLayer = selectedLayers[restoreIndex];
                var cacheEntry = expressionsCache[restoreIndex][selectedPropertyName];
                
                if (!cacheEntry) {
                    $.writeln("Нет кэша для слоя: " + restoreLayer.name);
                    continue;
                }
                
                try {
                    var restoreProperty = null;
                    var restorePathResult = null;

                    // Проверка для базовых трансформаций
                    if (selectedPropertyName === "Position" || selectedPropertyName === "Scale" ||
                        selectedPropertyName === "Rotation" || selectedPropertyName === "Opacity" || selectedPropertyName === "Anchor Point") {
                        restoreProperty = restoreLayer.property(selectedPropertyName);
                    } else {
                        // Ищем путь для других свойств
                        restorePathResult = findPropertyPath(restoreLayer, selectedPropertyName);
                        if (restorePathResult) {
                            restoreProperty = restorePathResult.property;
                        }
                    }

                    if (restoreProperty && restoreProperty.canSetExpression) {
                        // Восстанавливаем старое выражение из кэша
                        restoreProperty.expression = cacheEntry.expression;
                        $.writeln("Восстановлено выражение для слоя " + restoreLayer.name + 
                            (cacheEntry.hasExpression ? " (было выражение)" : " (не было выражения)"));
                    } else {
                        $.writeln("Не удалось восстановить выражение для слоя: " + restoreLayer.name);
                    }
                } catch (error) {
                    $.writeln("Ошибка при восстановлении выражения для слоя " + restoreLayer.name + ": " + error.message);
                }
            }
            
            app.endUndoGroup();
            alert("Операция отменена. Все изменения откачены.");
            return;
        }

        app.endUndoGroup();

        if (skippedLayers.length > 0) {
            alert('Выражение не удалось применить к следующим слоям:\n' + skippedLayers.join("\n"));
        } else {
            alert(trimmedExpression ? "Выражение успешно применено." : "Выражения очищены.");
        }
    };

    // Обработчик кнопки Clear All Expressions
    clearAllExpressionsButton.onClick = function () {
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

        var shouldClear = confirm(
            "Вы уверены, что хотите удалить ВСЕ выражения у выбранных слоев?\n\n" +
            "Это действие удалит все выражения у всех свойств слоев:\n" +
            "- Трансформации (Position, Scale, Rotation, Opacity, Anchor Point)\n" +
            "- Все эффекты и их свойства\n" +
            "- Все остальные свойства с выражениями\n\n" +
            "ОК - удалить все выражения\n" +
            "Отмена - оставить все без изменений"
        );
        
        if (!shouldClear) {
            return;
        }

        app.beginUndoGroup("Clear All Expressions");
        var clearedLayers = [];
        var skippedLayers = [];

        // Функция для рекурсивной очистки всех выражений у свойства
        function clearExpressionsRecursive(property) {
            try {
                // Очищаем выражение, если свойство поддерживает выражения
                if (property.canSetExpression) {
                    try {
                        // Пытаемся очистить выражение (даже если его нет)
                        property.expression = "";
                    } catch (e) {
                        // Игнорируем ошибки при очистке конкретного свойства
                    }
                }
                
                // Если это групповое свойство (например, Transform, Effect), проходим по всем дочерним
                if (property.numProperties > 0) {
                    for (var i = 1; i <= property.numProperties; i++) {
                        clearExpressionsRecursive(property.property(i));
                    }
                }
            } catch (error) {
                // Игнорируем ошибки при доступе к свойствам
            }
        }

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            try {
                // Очищаем выражения у всех свойств слоя
                if (layer.numProperties > 0) {
                    for (var j = 1; j <= layer.numProperties; j++) {
                        clearExpressionsRecursive(layer.property(j));
                    }
                }
                clearedLayers.push(layer.name);
                $.writeln("Все выражения очищены у слоя: " + layer.name);
            } catch (error) {
                $.writeln("Ошибка при очистке выражений на слое " + layer.name + ": " + error.message);
                skippedLayers.push(layer.name);
            }
        }

        app.endUndoGroup();

        if (skippedLayers.length > 0) {
            alert('Не удалось очистить выражения у следующих слоев:\n' + skippedLayers.join("\n"));
        } else {
            alert("Все выражения успешно очищены у " + clearedLayers.length + " слоев.");
        }
    };

    // Функция для нахождения пути к свойству с проверкой несовпадений
    // Возвращает объект: {property: Property, hasMismatch: Boolean, mismatchInfo: String, originalPath: Array, foundPath: Array}
    function findPropertyPath(layer, propertyName) {
        // Проверяем, что выбранное свойство было сохранено
        if (!selectedProperty) {
            alert("Свойство не было выбрано. Нажмите 'Get Custom Property' для выбора свойства.", "Ошибка");
            return null;
        }

        var originalPathArray = []; // Для поиска (matchName)
        var originalNameArray = []; // Для сравнения (name)
        var prop = selectedProperty;

        // Создаём массивы с полным путём к исходному свойству
        // Сохраняем и matchName (для поиска) и name (для сравнения)
        try {
            while (prop) {
                var pathPart = prop.matchName || prop.name;
                var namePart = prop.name;
                originalPathArray.unshift(pathPart);
                originalNameArray.unshift(namePart);
                prop = prop.parentProperty;
            }
        } catch (error) {
            alert("Выбранное свойство больше не доступно. Нажмите 'Get Custom Property' заново.", "Ошибка");
            return null;
        }

        // Убираем имя слоя
        originalPathArray.shift();
        originalNameArray.shift();
        
        $.writeln("=== findPropertyPath DEBUG ===");
        $.writeln("Слой: " + layer.name);
        $.writeln("Исходный путь (matchName для поиска): " + originalPathArray.join(" -> "));
        $.writeln("Исходный путь (name для сравнения): " + originalNameArray.join(" -> "));
        
        // Сохраняем имя конечного свойства (последний элемент пути)
        var finalPropertyName = originalNameArray[originalNameArray.length - 1]; // Используем name для сравнения
        $.writeln("Конечное свойство (finalPropertyName): " + finalPropertyName);

        // Ищем свойство по пути в указанном слое
        var currentProperty = layer;
        var foundPathArray = [];
        var hasMismatch = false;
        var mismatchInfo = "";

        for (var i = 0; i < originalPathArray.length; i++) {
            var originalPathPart = originalPathArray[i];
            var foundProperty = null;
            
            $.writeln("--- Шаг " + (i + 1) + " ---");
            $.writeln("Ищем: " + originalPathPart);
            $.writeln("Текущее свойство: " + (currentProperty.name || "layer"));
            
            // Проверяем, является ли часть пути числом
            var numericIndex = parseInt(originalPathPart);
            if (!isNaN(numericIndex) && String(numericIndex) === originalPathPart) {
                $.writeln("Используем числовой индекс: " + numericIndex);
                foundProperty = currentProperty.property(numericIndex);
            } else {
                $.writeln("Используем имя свойства: " + originalPathPart);
                foundProperty = currentProperty.property(originalPathPart);
            }
            
            if (!foundProperty) {
                $.writeln("ОШИБКА: Путь не найден на уровне: " + originalPathPart);
                return null;
            }
            
            // Получаем имя найденного свойства для сравнения
            // ВАЖНО: используем name для сравнения, чтобы видеть различия в именах эффектов
            // matchName одинаков для всех эффектов одного типа
            var foundName = foundProperty.name;
            var foundMatchName = foundProperty.matchName || foundProperty.name;
            
            $.writeln("Найдено свойство:");
            $.writeln("  - name: " + foundName);
            $.writeln("  - matchName: " + foundMatchName);
            
            // Сохраняем name для отображения в диалоге
            foundPathArray.push(foundName);
            
            // Получаем ожидаемое name из исходного пути
            var originalNameAtLevel = originalNameArray[i];
            
            $.writeln("Сравнение на уровне " + i + ":");
            $.writeln("  - Ожидаемое name: " + originalNameAtLevel);
            $.writeln("  - Найденное name: " + foundName);
            $.writeln("  - Совпадают: " + (originalNameAtLevel === foundName));
            
            // Проверяем несовпадение (кроме последнего элемента - конечного свойства)
            if (i < originalPathArray.length - 1 && originalNameAtLevel !== foundName) {
                hasMismatch = true;
                $.writeln("НЕСОВПАДЕНИЕ обнаружено!");
                if (!mismatchInfo) {
                    mismatchInfo = "Ожидалось: " + originalNameAtLevel + ", найдено: " + foundName;
                }
            }
            
            currentProperty = foundProperty;
        }
        
        $.writeln("--- Результат ---");
        $.writeln("Найденный путь (foundPathArray): " + foundPathArray.join(" -> "));
        $.writeln("hasMismatch: " + hasMismatch);
        
        // Проверяем, совпадает ли конечное свойство
        var finalFoundName = foundPathArray[foundPathArray.length - 1];
        var finalMatches = (finalPropertyName === finalFoundName);
        $.writeln("Конечное свойство совпадает: " + finalMatches + " (" + finalPropertyName + " === " + finalFoundName + ")");
        
        // Если есть несовпадения, но конечное свойство совпадает
        if (hasMismatch && finalMatches) {
            $.writeln("ВОЗВРАЩАЕМ: hasMismatch=true, finalMatches=true");
            $.writeln("========================");
            return {
                property: currentProperty,
                hasMismatch: true,
                mismatchInfo: mismatchInfo,
                originalPath: originalNameArray, // Используем name для отображения
                foundPath: foundPathArray
            };
        }
        
        // Если путь полностью совпадает или несовпадений нет
        $.writeln("ВОЗВРАЩАЕМ: hasMismatch=" + hasMismatch + ", finalMatches=" + finalMatches);
        $.writeln("========================");
        return {
            property: currentProperty,
            hasMismatch: false,
            mismatchInfo: "",
            originalPath: originalNameArray, // Используем name для отображения
            foundPath: foundPathArray
        };
    }
    
    // Функция для создания диалога с несовпадением пути
    function showMismatchDialog(layerName, mismatchInfo, originalPath, foundPath, hasMoreLayers) {
        var dialog = new Window("dialog", "Несовпадение пути к свойству");
        dialog.orientation = "column";
        dialog.alignChildren = "left";
        
        // Текст с информацией
        var infoGroup = dialog.add("group");
        infoGroup.orientation = "column";
        infoGroup.alignChildren = "left";
        
        var layerText = infoGroup.add("statictext", undefined, "Слой: " + layerName);
        try {
            layerText.graphics.font = ScriptUI.newFont(layerText.graphics.font.name, ScriptUI.FontStyle.BOLD);
        } catch (e) {
            // Если не удалось установить шрифт, просто используем обычный
        }
        
        infoGroup.add("statictext", undefined, "");
        infoGroup.add("statictext", undefined, "Обнаружено несовпадение в пути:");
        infoGroup.add("statictext", undefined, mismatchInfo);
        infoGroup.add("statictext", undefined, "");
        
        var pathGroup = infoGroup.add("group");
        pathGroup.orientation = "row";
        pathGroup.alignChildren = "left";
        
        var originalGroup = pathGroup.add("group");
        originalGroup.orientation = "column";
        originalGroup.add("statictext", undefined, "Ожидаемый путь:");
        var originalText = originalGroup.add("statictext", undefined, originalPath.join(" -> "));
        try {
            originalText.graphics.font = ScriptUI.newFont(originalText.graphics.font.name, ScriptUI.FontStyle.ITALIC);
        } catch (e) {
            // Если не удалось установить шрифт, просто используем обычный
        }
        
        pathGroup.add("statictext", undefined, "  →  ");
        
        var foundGroup = pathGroup.add("group");
        foundGroup.orientation = "column";
        foundGroup.add("statictext", undefined, "Найденный путь:");
        var foundText = foundGroup.add("statictext", undefined, foundPath.join(" -> "));
        try {
            foundText.graphics.font = ScriptUI.newFont(foundText.graphics.font.name, ScriptUI.FontStyle.ITALIC);
        } catch (e) {
            // Если не удалось установить шрифт, просто используем обычный
        }
        
        infoGroup.add("statictext", undefined, "");
        infoGroup.add("statictext", undefined, "Конечное свойство совпадает. Применить выражение?");
        
        // Чекбокс для применения ко всем остальным (только если есть еще слои)
        var applyToAllCheck = null;
        if (hasMoreLayers) {
            infoGroup.add("statictext", undefined, "");
            applyToAllCheck = infoGroup.add("checkbox", undefined, "Применить это решение ко всем остальным слоям");
        }
        
        // Кнопки
        var buttonGroup = dialog.add("group");
        buttonGroup.orientation = "row";
        buttonGroup.alignment = "right";
        
        var applyButton = buttonGroup.add("button", undefined, "Применить");
        applyButton.preferredSize = [100, 25];
        var skipButton = buttonGroup.add("button", undefined, "Пропустить");
        skipButton.preferredSize = [100, 25];
        var abortButton = buttonGroup.add("button", undefined, "Отменить операцию");
        abortButton.preferredSize = [150, 25];
        
        applyButton.onClick = function() {
            dialog.close(1); // 1 = применить
        };
        
        skipButton.onClick = function() {
            dialog.close(0); // 0 = пропустить
        };
        
        abortButton.onClick = function() {
            dialog.close(2); // 2 = отменить операцию
        };
        
        dialog.center();
        var result = dialog.show();
        
        return {
            apply: result === 1,
            applyToAll: applyToAllCheck ? applyToAllCheck.value : false,
            abort: result === 2 // Отменить всю операцию
        };
    }



})(this);
