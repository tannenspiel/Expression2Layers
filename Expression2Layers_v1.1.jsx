(function propertyExpressionTool(thisObj) {
    // ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
    var selectedProperty = null;
    var expressionsCache = []; // Для отмены текущей операции
    var expressionSnapshot = {}; // Долгосрочный снимок выражений
    
    // Управление окном
    if (thisObj.propertyExpressionToolWindow && !thisObj.propertyExpressionToolWindow.closed) {
        thisObj.propertyExpressionToolWindow.show();
        return;
    }

    // СОЗДАНИЕ UI (БЕЗ уменьшения размеров)
    var scriptWindow = new Window("palette", "Property Expression Tool", undefined, {resizeable: true});
    scriptWindow.orientation = "column";

    var expressionGroup = scriptWindow.add("group");
    expressionGroup.orientation = "column";
    expressionGroup.add("statictext", undefined, "Expression Text:");
    var expressionInput = expressionGroup.add("edittext", undefined, "", {multiline: true});
    expressionInput.size = [600, 300]; // ОСТАВЛЯЕМ БОЛЬШОЙ РАЗМЕР

    var getPropertyButton = scriptWindow.add("button", undefined, "Get Custom Property");
    getPropertyButton.size = [300, 25];
    
    var propertyList = scriptWindow.add("listbox", undefined, ["Position", "Scale", "Rotation", "Opacity", "Anchor Point"]);
    propertyList.size = [300, 150];

    // КНОПКИ ОСНОВНЫХ ОПЕРАЦИЙ
    var mainButtonsGroup = scriptWindow.add("group");
    mainButtonsGroup.orientation = "column";
    
    var writeExpressionButton = mainButtonsGroup.add("button", undefined, "WRITE EXPRESSION to Selected Layers");
    writeExpressionButton.size = [300, 75];
    
    var clearAllExpressionsButton = mainButtonsGroup.add("button", undefined, "CLEAR ALL EXPRESSIONS from Selected Layers");
    clearAllExpressionsButton.size = [300, 50];
    
    // КНОПКИ СНИМКОВ
    var snapshotGroup = scriptWindow.add("group");
    snapshotGroup.orientation = "column";
    snapshotGroup.margins = [0, 10, 0, 0];
    
    var snapshotLabel = snapshotGroup.add("statictext", undefined, "=== EXPRESSION SNAPSHOTS ===");
    try { 
        snapshotLabel.graphics.font = ScriptUI.newFont(snapshotLabel.graphics.font.name, ScriptUI.FontStyle.BOLD); 
    } catch(e){}
    
    var saveSnapshotButton = snapshotGroup.add("button", undefined, "Save Snapshot: (выберите свойство)");
    saveSnapshotButton.size = [300, 35];
    
    var restoreSnapshotButton = snapshotGroup.add("button", undefined, "Restore Snapshot: (нет снимка)");
    restoreSnapshotButton.size = [300, 35];
    
    var saveFullSnapshotButton = snapshotGroup.add("button", undefined, "Save FULL Snapshot (All Properties)");
    saveFullSnapshotButton.size = [300, 35];
    
    var restoreFullSnapshotButton = snapshotGroup.add("button", undefined, "Restore FULL Snapshot (All Properties)");
    restoreFullSnapshotButton.size = [300, 35];
    
    scriptWindow.onClose = function () {
        thisObj.propertyExpressionToolWindow = null;
    };

    thisObj.propertyExpressionToolWindow = scriptWindow;
    scriptWindow.center();
    scriptWindow.show();

    // ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ НАЗВАНИЙ КНОПОК
    function updateSnapshotButtonLabels() {
        var selectedPropertyName = propertyList.selection ? propertyList.selection.text : null;
        if (selectedPropertyName) {
            var displayName = selectedPropertyName.replace(/^Custom: /, "");
            saveSnapshotButton.text = "Save Snapshot: " + displayName;
        } else {
            saveSnapshotButton.text = "Save Snapshot: (выберите свойство)";
        }
        
        if (expressionSnapshot.type === "selectedProperty" && expressionSnapshot.propertyName) {
            var savedName = expressionSnapshot.propertyName.replace(/^Custom: /, "");
            restoreSnapshotButton.text = "Restore Snapshot: " + savedName;
            restoreSnapshotButton.enabled = true;
        } else {
            restoreSnapshotButton.text = "Restore Snapshot: (нет снимка)";
            restoreSnapshotButton.enabled = false;
        }
        
        // Обновляем кнопки FULL Snapshot
        var fullCount = Object.keys(expressionSnapshot.data || {}).length;
        if (expressionSnapshot.type === "full" && fullCount > 0) {
            restoreFullSnapshotButton.text = "Restore FULL Snapshot (" + fullCount + " слоев)";
            restoreFullSnapshotButton.enabled = true;
        } else {
            restoreFullSnapshotButton.text = "Restore FULL Snapshot (All Properties)";
            restoreFullSnapshotButton.enabled = false;
        }
    }
    
    // Инициализируем названия кнопок при открытии окна
    updateSnapshotButtonLabels();

    // ОБРАБОТЧИКИ КНОПОК

    getPropertyButton.onClick = function () {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert("Выберите композицию.", "Ошибка");
            return;
        }

        var deepestProp = getDeepestSelectedProperty(comp);
        if (!deepestProp) {
            alert("Выберите одно свойство.", "Ошибка");
            return;
        }

        selectedProperty = deepestProp;
        alert("Выбрано: " + deepestProp.name);

        propertyList.removeAll();
        var baseProps = ["Position", "Scale", "Rotation", "Opacity", "Anchor Point"];
        for (var i = 0; i < baseProps.length; i++) {
            propertyList.add("item", baseProps[i]);
        }
        propertyList.add("item", "Custom: " + deepestProp.name);
        
        // Обновляем названия кнопок снимков
        updateSnapshotButtonLabels();
    };

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

        // ВАЛИДАЦИЯ выражения
        var expressionText = expressionInput.text;
        var trimmedExpression = expressionText.trim();

        if (!trimmedExpression) {
            if (!confirm("Выражение пустое или содержит только пробелы.\n\n" +
                         "ОК - УДАЛИТЬ существующие выражения\n" +
                         "Отмена - оставить без изменений")) {
                return;
            }
        }

        app.beginUndoGroup("Write Expression");
        expressionsCache = []; // ОЧИЩАЕМ КЭШ перед операцией (!!!)
        var skippedLayers = [];
        var applyToAllDecision = null;
        var shouldAbort = false;

        for (var i = 0; i < selectedLayers.length && !shouldAbort; i++) {
            var layer = selectedLayers[i];
            try {
                // ОДИН ПРОХОД: находим свойство и сохраняем в кэш
                var result = findPropertyPath(layer, selectedPropertyName);
                if (!result || !result.property) {
                    skippedLayers.push(layer.name + " (свойство не найдено)");
                    continue;
                }
                
                var property = result.property;
                
                // СОХРАНЯЕМ в кэш (в том же порядке, что и selectedLayers)
                expressionsCache.push({
                    layer: layer,
                    property: property,
                    oldExpression: property.expression
                });

                // ПРОВЕРЯЕМ несовпадения
                if (result.hasMismatch && applyToAllDecision === null) {
                                var dialogResult = showMismatchDialog(
                                    layer.name,
                        result.mismatchInfo,
                        result.originalPath,
                        result.foundPath,
                        i < selectedLayers.length - 1
                    );
                    
                                if (dialogResult.abort) {
                                    shouldAbort = true;
                                    break;
                                }
                                
                                if (dialogResult.applyToAll) {
                                    applyToAllDecision = dialogResult.apply;
                                }
                                
                                if (!dialogResult.apply) {
                                    skippedLayers.push(layer.name + " (пропущен из-за несовпадения)");
                                    continue;
                    }
                }
                
                // ПРИМЕНЯЕМ выражение
                if (property.canSetExpression) {
                    property.expression = trimmedExpression;
                    $.writeln(trimmedExpression ? 
                        "Выражение применено: " + layer.name : 
                        "Выражение очищено: " + layer.name
                    );
                } else {
                    skippedLayers.push(layer.name + " (свойство не поддерживает выражения)");
                }
            } catch (error) {
                $.writeln("Ошибка: " + layer.name + ": " + error.message);
                skippedLayers.push(layer.name + " (ошибка)");
            }
        }

        // КОРРЕКТНАЯ ОТМЕНА: восстанавливаем только из кэша
        if (shouldAbort) {
            for (var j = 0; j < expressionsCache.length; j++) {
                var cache = expressionsCache[j];
                if (cache.property && cache.property.canSetExpression) {
                    cache.property.expression = cache.oldExpression;
                    $.writeln("Восстановлено выражение: " + cache.layer.name);
                }
            }
            app.endUndoGroup();
            expressionsCache = []; // ОЧИЩАЕМ КЭШ после отмены (!!!)
            alert("Операция отменена. Все изменения откачены.");
            return;
        }

        app.endUndoGroup();
        expressionsCache = []; // ОЧИЩАЕМ КЭШ после успеха (!!!)

        if (skippedLayers.length > 0) {
            alert('Некоторые слои пропущены:\n' + skippedLayers.join("\n"));
                } else {
            alert(trimmedExpression ? "Выражение успешно применено." : "Выражения очищены.");
        }
    };

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

        if (!confirm("Очистить ВСЕ выражения у " + selectedLayers.length + " слоев?")) {
            return;
        }

        app.beginUndoGroup("Clear All Expressions");
        var clearedLayers = [];

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            try {
                clearExpressionsRecursive(layer);
                clearedLayers.push(layer.name);
                $.writeln("Все выражения очищены у слоя: " + layer.name);
            } catch (error) {
                $.writeln("Ошибка при очистке слоя " + layer.name + ": " + error.message);
            }
        }

        app.endUndoGroup();
        alert("Очищено " + clearedLayers.length + " слоев.");
    };

    // ===== СНИМКИ СОСТОЯНИЙ (ИСПРАВЛЕННЫЕ) =====

    saveSnapshotButton.onClick = function () {
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

        // ОПРЕДЕЛЯЕМ ТИП СВОЙСТВА И СОХРАНЯЕМ ПУТЬ
        var isBaseProperty = (selectedPropertyName === "Position" || selectedPropertyName === "Scale" ||
                             selectedPropertyName === "Rotation" || selectedPropertyName === "Opacity" ||
                             selectedPropertyName === "Anchor Point");
        
        var propertyPath = null; // Для кастомных свойств
        var propertyPathNames = null;
        
        if (!isBaseProperty) {
            // Безопасная проверка isValid
            var isValidProperty = false;
            try {
                isValidProperty = (selectedProperty && selectedProperty.isValid !== false);
            } catch (e) {
                isValidProperty = (selectedProperty !== null);
            }
            
            if (!selectedProperty || !isValidProperty) {
                alert("Для кастомного свойства нужно сначала нажать 'Get Custom Property'.\nИли выбранное свойство больше не существует.", "Ошибка");
                return;
            }
            
            // Сохраняем путь УЖЕ СЕЙЧАС, а не при восстановлении
            var pathArray = [];
            var nameArray = [];
            var prop = selectedProperty;
            
            try {
                var maxIterations = 100;
                var iterations = 0;
                while (prop && iterations < maxIterations) {
                    pathArray.unshift(prop.matchName || prop.name);
                    nameArray.unshift(prop.name);
                    prop = prop.parentProperty;
                    iterations++;
                }
            } catch (e) {
                alert("Ошибка при сохранении пути к свойству.", "Ошибка");
                return;
            }
            
            pathArray.shift(); // Убираем слой
            nameArray.shift();
            
            propertyPath = pathArray;
            propertyPathNames = nameArray;
        }

        // СОЗДАЕМ СНИМОК
        expressionSnapshot = { 
            type: "selectedProperty", 
            propertyName: selectedPropertyName,
            isBaseProperty: isBaseProperty,
            propertyPath: propertyPath, // null для базовых свойств
            propertyPathNames: propertyPathNames,
            data: {} 
        };
        
        $.writeln("=== СОЗДАН СНИМОК ===");
        $.writeln("type: " + expressionSnapshot.type);
        $.writeln("propertyName: " + expressionSnapshot.propertyName);
        $.writeln("isBaseProperty: " + expressionSnapshot.isBaseProperty);
        $.writeln("propertyPath: " + (expressionSnapshot.propertyPath ? expressionSnapshot.propertyPath.join(" -> ") : "null"));

        $.writeln("=== SAVE SNAPSHOT: " + selectedPropertyName + " ===");
        $.writeln("Слоев для обработки: " + selectedLayers.length);
        $.writeln("Это базовое свойство: " + isBaseProperty);

        // Сканируем выбранные слои
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
                var property = null;
            
            if (isBaseProperty) {
                // Базовые свойства
                try {
                    property = layer.property(selectedPropertyName);
                    $.writeln("  Слой '" + layer.name + "': базовое свойство '" + selectedPropertyName + "'");
                    } catch (e) {
                    $.writeln("  Слой '" + layer.name + "': ОШИБКА доступа - " + e.message);
                }
                } else {
                // Кастомные свойства
                $.writeln("  Слой '" + layer.name + "': ищем по пути '" + propertyPathNames.join(" -> ") + "'");
                property = findPropertyByPath(layer, propertyPath);
            }
            
            if (property && property.canSetExpression) {
                expressionSnapshot.data[layer.name] = {
                    expression: property.expression || ""
                };
                $.writeln("    ✓ Сохранено выражение: '" + (property.expression || "(пусто)") + "'");
                            } else {
                $.writeln("    ✗ Свойство не найдено или не поддерживает выражения");
            }
        }

        var savedCount = Object.keys(expressionSnapshot.data).length;
        $.writeln("=== СНИМОК СОХРАНЕН: " + savedCount + " слоев ===");
        
        alert("Снимок сохранен: " + selectedPropertyName + "\nСлоев: " + savedCount + " из " + selectedLayers.length);
        updateSnapshotButtonLabels();
    };

    restoreSnapshotButton.onClick = function () {
        $.writeln("=== RESTORE SNAPSHOT BUTTON CLICKED ===");
        $.writeln("expressionSnapshot.type: " + (expressionSnapshot.type || "undefined"));
        $.writeln("expressionSnapshot.data: " + (expressionSnapshot.data ? Object.keys(expressionSnapshot.data).length + " слоев" : "undefined"));
        
        if (expressionSnapshot.type !== "selectedProperty") {
            $.writeln("ОШИБКА: Нет сохраненного снимка для свойства. type=" + expressionSnapshot.type);
            alert("Нет сохраненного снимка для свойства.", "Ошибка");
            return;
        }

        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            $.writeln("ОШИБКА: Не выбрана композиция");
            alert("Выберите композицию.", "Ошибка");
            return;
        }

        // ВОССТАНАВЛИВАЕМ из снимка, а не из текущего выбора!
        var layersToRestore = Object.keys(expressionSnapshot.data);
        $.writeln("layersToRestore: " + layersToRestore.length + " слоев");
        if (layersToRestore.length === 0) {
            $.writeln("ОШИБКА: В снимке нет данных для восстановления");
            alert("В снимке нет данных для восстановления.", "Ошибка");
            return;
        }

        // Сбрасываем выделение и собираем проблемные слои
        // В After Effects нет метода deselectAllLayers(), поэтому просто собираем проблемные слои
        var problemLayers = [];
        
        $.writeln("=== RESTORE SNAPSHOT: " + expressionSnapshot.propertyName + " ===");
        $.writeln("Слоев для восстановления: " + layersToRestore.length);

        // ПРОВЕРКА ПЕРЕД ВОССТАНОВЛЕНИЕМ
        $.writeln("Начинаем проверку свойств...");
        var missingProperties = [];
        for (var i = 0; i < layersToRestore.length; i++) {
            var layerName = layersToRestore[i];
            $.writeln("  Проверяем слой: " + layerName);
            var layer = findLayerByName(comp, layerName);
            
            if (!layer) {
                $.writeln("    ✗ Слой не найден");
                missingProperties.push(layerName + " (слой не найден в композиции)");
                                    continue;
                                }
            
            var prop = null;
            try {
                if (expressionSnapshot.isBaseProperty) {
                    prop = layer.property(expressionSnapshot.propertyName);
                    $.writeln("    ✓ Базовое свойство найдено: " + expressionSnapshot.propertyName);
                        } else {
                    prop = findPropertyByPath(layer, expressionSnapshot.propertyPath);
                    $.writeln("    " + (prop ? "✓" : "✗") + " Кастомное свойство " + (prop ? "найдено" : "не найдено"));
                }
            } catch (e) {
                $.writeln("    ✗ Ошибка при поиске свойства: " + e.message);
            }
            
            if (!prop || !prop.canSetExpression) {
                missingProperties.push(layerName + " (свойство не найдено)");
                $.writeln("    ✗ Свойство не найдено или не поддерживает выражения");
                } else {
                $.writeln("    ✓ Свойство найдено и поддерживает выражения");
            }
        }
        
        $.writeln("Проверка завершена. Проблемных слоев: " + missingProperties.length);
        
        if (missingProperties.length > 0) {
            $.writeln("Показываем диалог с предупреждением...");
            var shouldContinue = confirm(
                "⚠️ ВНИМАНИЕ: Следующие слои из снимка имеют проблемы:\n" +
                missingProperties.join("\n") + "\n\n" +
                "Возможные причины:\n" +
                "- Эффект/свойство был удален\n" +
                "- Слой был переименован\n" +
                "- Порядок эффектов изменился\n\n" +
                "Продолжить восстановление для остальных слоев?"
            );
            if (!shouldContinue) {
                $.writeln("=== ВОССТАНОВЛЕНИЕ ОТМЕНЕНО ПОЛЬЗОВАТЕЛЕМ ===");
                return;
            }
            $.writeln("Пользователь решил продолжить восстановление");
        }

        $.writeln("Начинаем восстановление выражений...");
        app.beginUndoGroup("Restore Expression Snapshot");
        var restored = 0;
        var failed = 0;
        var restoredLayersList = []; // Список слоев, которым восстановили выражения

        // ВОССТАНАВЛИВАЕМ по данным из снимка
        $.writeln("Начинаем цикл восстановления для " + layersToRestore.length + " слоев");
        for (var i = 0; i < layersToRestore.length; i++) {
            var layerName = layersToRestore[i];
            $.writeln("  [" + (i + 1) + "/" + layersToRestore.length + "] Обрабатываем слой: " + layerName);
            var layer = findLayerByName(comp, layerName);
            
            if (!layer) {
                $.writeln("    ✗ Слой НЕ НАЙДЕН в композиции");
                failed++;
                    continue;
                }
            
            var snapshot = expressionSnapshot.data[layerName];
            if (!snapshot) {
                $.writeln("    ✗ Нет данных в снимке");
                failed++;
                continue;
            }
            
            $.writeln("    Данные в снимке: expression='" + (snapshot.expression || "(пусто)") + "'");

            try {
                var property = null;
                
                if (expressionSnapshot.isBaseProperty) {
                    $.writeln("    Ищем базовое свойство: " + expressionSnapshot.propertyName);
                    property = layer.property(expressionSnapshot.propertyName);
                    $.writeln("    " + (property ? "✓" : "✗") + " Свойство " + (property ? "найдено" : "не найдено"));
                    } else {
                    $.writeln("    Ищем по пути: " + expressionSnapshot.propertyPathNames.join(" -> "));
                    property = findPropertyByPath(layer, expressionSnapshot.propertyPath);
                    $.writeln("    " + (property ? "✓" : "✗") + " Свойство " + (property ? "найдено" : "не найдено"));
                }
                
                if (property && property.canSetExpression) {
                    var exprToRestore = snapshot.expression || "";
                    $.writeln("    Устанавливаем выражение: '" + (exprToRestore || "(пусто)") + "'");
                    property.expression = exprToRestore;
                    restored++;
                    $.writeln("    ✓ Восстановлено: '" + (exprToRestore || "(пусто)") + "'");
                    
                    // Если восстановили выражение, добавляем слой в список для раскрытия
                    restoredLayersList.push(layer);
                    } else {
                    $.writeln("    ✗ Свойство не найдено или не поддерживает выражения");
                    problemLayers.push(layer);
                    failed++;
                }
            } catch (e) {
                $.writeln("    ✗ ОШИБКА: " + e.message);
                problemLayers.push(layer);
                failed++;
            }
        }
        
        $.writeln("Цикл восстановления завершен. Восстановлено: " + restored + ", Ошибок: " + failed);
            
            app.endUndoGroup();
        
        // Раскрываем только выбранное свойство для восстановленных слоев
        // (выделение слоев происходит внутри revealExpressionProperty - только для тех, у кого есть выражения)
        if (restoredLayersList.length > 0) {
            $.writeln("Раскрываем свойство '" + expressionSnapshot.propertyName + "' для " + restoredLayersList.length + " слоев...");
            revealExpressionProperty(restoredLayersList, expressionSnapshot.propertyName, expressionSnapshot.isBaseProperty, expressionSnapshot.propertyPath);
        }
        
        // Выделяем проблемные слои (в самом конце)
        if (problemLayers.length > 0) {
            for (var i = 0; i < problemLayers.length; i++) {
                problemLayers[i].selected = true;
            }
        }
        
        $.writeln("=== ВОССТАНОВЛЕНИЕ ЗАВЕРШЕНО: " + restored + " успешно, " + failed + " с ошибками ===");
        
        var message = "Восстановлено " + restored + " выражений.";
        if (problemLayers.length > 0) {
            message += "\n\n" + problemLayers.length + " слоев с ошибками выделены в композиции.";
        }
        alert(message);
        
        updateSnapshotButtonLabels();
    };

    saveFullSnapshotButton.onClick = function () {
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

        expressionSnapshot = { type: "full", data: {} };

        $.writeln("=== SAVE FULL SNAPSHOT ===");
        $.writeln("Слоев для обработки: " + selectedLayers.length);

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            expressionSnapshot.data[layer.name] = {};
            $.writeln("  Слой '" + layer.name + "': сканируем все свойства");
            scanAllExpressions(layer, expressionSnapshot.data[layer.name]);
        }
        
        var savedCount = Object.keys(expressionSnapshot.data).length;
        $.writeln("=== ПОЛНЫЙ СНИМОК СОХРАНЕН: " + savedCount + " слоев ===");
        
        alert("Полный снимок сохранен для " + selectedLayers.length + " слоев.");
        updateSnapshotButtonLabels();
    };

    restoreFullSnapshotButton.onClick = function () {
        if (expressionSnapshot.type !== "full") {
            alert("Нет сохраненного полного снимка.", "Ошибка");
            return;
        }

        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert("Выберите композицию.", "Ошибка");
            return;
        }

        // ВОССТАНАВЛИВАЕМ из снимка!
        var layersToRestore = Object.keys(expressionSnapshot.data);
        if (layersToRestore.length === 0) {
            alert("В снимке нет данных для восстановления.", "Ошибка");
            return;
        }
        
        $.writeln("=== RESTORE FULL SNAPSHOT ===");
        $.writeln("Слоев для восстановления: " + layersToRestore.length);

        // ПРОВЕРКА: покажем слои, которых нет в композиции
        $.writeln("Проверяем наличие слоев в композиции...");
        var missingLayers = [];
        for (var i = 0; i < layersToRestore.length; i++) {
            var layerName = layersToRestore[i];
            if (!findLayerByName(comp, layerName)) {
                missingLayers.push(layerName);
                $.writeln("  ✗ Слой не найден: " + layerName);
            } else {
                $.writeln("  ✓ Слой найден: " + layerName);
            }
        }
        
        $.writeln("Проверка завершена. Отсутствующих слоев: " + missingLayers.length);
        
        if (missingLayers.length > 0) {
            $.writeln("Показываем диалог с предупреждением о недостающих слоях...");
            var shouldContinue = confirm(
                "⚠️ ВНИМАНИЕ: Следующие слои из снимка не найдены:\n" +
                missingLayers.join("\n") + "\n\n" +
                "Продолжить восстановление для остальных слоев?"
            );
            if (!shouldContinue) {
                $.writeln("=== ВОССТАНОВЛЕНИЕ ОТМЕНЕНО ПОЛЬЗОВАТЕЛЕМ ===");
                return;
            }
            $.writeln("Пользователь решил продолжить восстановление");
        }

        $.writeln("Показываем диалог подтверждения...");
        if (!confirm("Восстановить ВСЕ выражения из полного снимка?\nЭто перезапишет текущие выражения!")) {
            $.writeln("=== ВОССТАНОВЛЕНИЕ ОТМЕНЕНО ПОЛЬЗОВАТЕЛЕМ ===");
            return;
        }
        $.writeln("Пользователь подтвердил восстановление");

        // Собираем проблемные слои
        var problemLayers = [];

        $.writeln("Начинаем восстановление выражений...");
        app.beginUndoGroup("Restore Full Snapshot");
        var restored = 0;

        // ВОССТАНАВЛИВАЕМ по данным из снимка
        var restoredLayersList = []; // Список слоев, которым восстановили выражения
        $.writeln("Начинаем цикл восстановления для " + layersToRestore.length + " слоев");
        for (var i = 0; i < layersToRestore.length; i++) {
            var layerName = layersToRestore[i];
            $.writeln("  [" + (i + 1) + "/" + layersToRestore.length + "] Обрабатываем слой: " + layerName);
            var layer = findLayerByName(comp, layerName);
            
            if (!layer) {
                $.writeln("    ✗ Слой НЕ НАЙДЕН");
                continue; // Уже предупредили
            }
            
            var expressions = expressionSnapshot.data[layerName];
            $.writeln("    Данные в снимке: " + (Object.keys(expressions).length > 0 ? Object.keys(expressions).length + " ключей" : "пусто"));
            if (expressions._children) {
                $.writeln("    _children: " + Object.keys(expressions._children).length + " свойств");
            }
            
            var layerRestored = 0;
            try {
                $.writeln("    Вызываем restoreExpressionsRecursive...");
                layerRestored = restoreExpressionsRecursive(layer, expressions);
                restored += layerRestored;
                $.writeln("    ✓ Восстановлено " + layerRestored + " выражений");
                
                // Если восстановили хотя бы одно выражение, добавляем слой в список для раскрытия
                if (layerRestored > 0) {
                    restoredLayersList.push(layer);
                }
                
                // Если в снимке были реальные выражения, но не восстановилось ни одного — возможно, структура изменилась
                var hasExpressionsInSnapshot = hasRealExpressionsInSnapshot(expressions);
                if (layerRestored === 0 && hasExpressionsInSnapshot) {
                    $.writeln("    ⚠ Внимание: в снимке были выражения, но не восстановилось ни одного!");
                    problemLayers.push(layer);
                } else if (layerRestored === 0 && !hasExpressionsInSnapshot) {
                    $.writeln("    ℹ В снимке не было выражений для этого слоя (это нормально)");
                }
            } catch (e) {
                $.writeln("    ✗ ОШИБКА: " + e.message);
                problemLayers.push(layer);
            }
        }
        
        $.writeln("Цикл восстановления завершен. Восстановлено: " + restored + ", Проблемных слоев: " + problemLayers.length);

        app.endUndoGroup();

        // Раскрываем ВСЕ свойства с выражениями для всех успешно восстановленных слоев
        // (выделение слоев происходит внутри revealExpressionProperties - только для тех, у кого есть выражения)
        if (restoredLayersList.length > 0) {
            $.writeln("Раскрываем все свойства с выражениями для " + restoredLayersList.length + " слоев...");
            revealExpressionProperties(restoredLayersList);
        }
        
        // Выделяем проблемные слои (в самом конце)
        if (problemLayers.length > 0) {
            for (var i = 0; i < problemLayers.length; i++) {
                problemLayers[i].selected = true;
            }
        }
        
        $.writeln("=== ВОССТАНОВЛЕНИЕ ЗАВЕРШЕНО: " + restored + " выражений, " + problemLayers.length + " слоев с проблемами ===");
        
        var message = "Восстановлено " + restored + " выражений.";
        if (problemLayers.length > 0) {
            message += "\n\n" + problemLayers.length + " слоев с проблемами выделены в композиции.";
        }
        alert(message);
        updateSnapshotButtonLabels();
    };

    // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
    
    function getDeepestSelectedProperty(comp) {
        var deepestProp = null;
        var count = 0;
        var depth = 0;
        for (var i = 0; i < comp.selectedProperties.length; i++) {
            var prop = comp.selectedProperties[i];
            if (prop.propertyDepth >= depth) {
                if (prop.propertyDepth > depth) count = 0;
                deepestProp = prop;
                count++;
                depth = prop.propertyDepth;
            }
        }
        return (count === 1) ? deepestProp : null;
    }

    function findPropertyPath(layer, propertyName) {
        if (!selectedProperty) return null;
        
        // БЕЗОПАСНАЯ проверка isValid
        var isValid = false;
        try {
            isValid = selectedProperty && selectedProperty.isValid !== false;
        } catch (e) {
            isValid = (selectedProperty !== null);
        }
        
        if (!isValid) {
            $.writeln("Ошибка: выбранное свойство больше не существует.");
            return null;
        }

        var pathArray = [];
        var nameArray = [];
        var prop = selectedProperty;

        try {
            var maxIterations = 100;
            var iterations = 0;
            while (prop && iterations < maxIterations) {
                pathArray.unshift(prop.matchName || prop.name);
                nameArray.unshift(prop.name);
                prop = prop.parentProperty;
                iterations++;
            }
        } catch (e) {
            return null;
        }

        pathArray.shift();
        nameArray.shift();
        
        var currentProperty = layer;
        var foundNames = [];
        var hasMismatch = false;
        var mismatchInfo = "";

        for (var i = 0; i < pathArray.length; i++) {
            var part = pathArray[i];
            var numericIndex = parseInt(part);
            var child = null;
            
            if (!isNaN(numericIndex) && String(numericIndex) === part) {
                child = currentProperty.property(numericIndex);
            } else {
                child = currentProperty.property(part);
            }
            
            if (!child) return null;
            
            foundNames.push(child.name);
            
            if (i < pathArray.length - 1 && nameArray[i] !== child.name) {
                hasMismatch = true;
                mismatchInfo = nameArray[i] + " → " + child.name;
            }
            
            currentProperty = child;
        }
        
        return {
            property: currentProperty,
            hasMismatch: hasMismatch,
            mismatchInfo: mismatchInfo,
            originalPath: nameArray,
            foundPath: foundNames
        };
    }

    function findPropertyByPath(layer, pathArray) {
        var current = layer;
        for (var i = 0; i < pathArray.length; i++) {
            var part = pathArray[i];
            var num = parseInt(part);
            if (!isNaN(num) && String(num) === part) {
                try {
                    current = current.property(num);
                } catch (e) {
                    $.writeln("Ошибка доступа к свойству по индексу " + num + ": " + e.message);
                    return null;
                }
            } else {
                try {
                    current = current.property(part);
                } catch (e) {
                    $.writeln("Ошибка доступа к свойству по имени " + part + ": " + e.message);
                    return null;
                }
            }
            if (!current) return null;
        }
        return current;
    }

    function scanAllExpressions(property, snapshotObj) {
        try {
            if (property.canSetExpression) {
                var expr = property.expression;
                if (expr && expr.length > 0) {
                    snapshotObj[property.name] = expr;
                    $.writeln("        Сохранено выражение для '" + property.name + "': '" + expr.substring(0, 50) + "...'");
                }
            }
            if (property.numProperties > 0) {
                if (!snapshotObj._children) {
                    snapshotObj._children = {};
                }
                for (var i = 1; i <= property.numProperties; i++) {
                    var childProp = property.property(i);
                    var childName = childProp.name;
                    if (!snapshotObj._children[childName]) {
                        snapshotObj._children[childName] = {};
                    }
                    scanAllExpressions(childProp, snapshotObj._children[childName]);
                }
            }
        } catch (e) {
            $.writeln("        Ошибка при сканировании '" + (property.name || "unknown") + "': " + e.message);
        }
    }

    function restoreExpressionsRecursive(property, snapshotObj) {
        var restored = 0;
        try {
            // Проверяем, есть ли выражение для текущего свойства
            if (property.canSetExpression && snapshotObj[property.name]) {
                property.expression = snapshotObj[property.name];
                restored++;
                $.writeln("      Восстановлено выражение для '" + property.name + "'");
            }
            
            // Восстанавливаем дочерние свойства
            if (property.numProperties > 0 && snapshotObj._children) {
                for (var i = 1; i <= property.numProperties; i++) {
                    var childProp = property.property(i);
                    var childName = childProp.name;
                    if (snapshotObj._children[childName]) {
                        restored += restoreExpressionsRecursive(childProp, snapshotObj._children[childName]);
                    }
                }
            }
        } catch (e) {
            $.writeln("      Ошибка при восстановлении '" + (property.name || "unknown") + "': " + e.message);
        }
        return restored;
    }
    
    // Функция для проверки, есть ли реальные выражения в структуре снимка
    function hasRealExpressionsInSnapshot(snapshotObj) {
        // Проверяем корневой уровень - есть ли ключи, которые не _children
        for (var key in snapshotObj) {
            if (key !== "_children" && snapshotObj[key]) {
                return true; // Нашли реальное выражение
            }
        }
        
        // Проверяем _children рекурсивно
        if (snapshotObj._children) {
            for (var childName in snapshotObj._children) {
                if (hasRealExpressionsInSnapshot(snapshotObj._children[childName])) {
                    return true;
                }
            }
        }
        
        return false;
    }

    function findLayerByName(comp, name) {
        for (var i = 1; i <= comp.numLayers; i++) {
            if (comp.layer(i).name === name) return comp.layer(i);
        }
                return null;
            }
            
    // Функция для раскрытия конкретного свойства с выражением
    function revealExpressionProperty(layers, propertyName, isBaseProperty, propertyPath) {
        if (!layers || layers.length === 0) {
            $.writeln("revealExpressionProperty: нет слоев для обработки");
            return;
        }
        
        var targetProps = [];
        var layersWithExpressions = []; // Слои, у которых есть выражения в нужном свойстве
        
        $.writeln("=== НАЧАЛО СБОРА СВОЙСТВА '" + propertyName + "' ===");
        $.writeln("Обрабатываем " + layers.length + " слоев");
        
        // Собираем только указанное свойство для всех слоев
        for (var l = 0; l < layers.length; l++) {
            var layer = layers[l];
            if (!layer) continue;
            
            try {
                var prop = null;
                if (isBaseProperty) {
                    prop = layer.property(propertyName);
                } else {
                    prop = findPropertyByPath(layer, propertyPath);
                }
                
                if (prop && prop.canSetExpression) {
                    var expr = prop.expression;
                    if (expr && expr !== "") {
                        // Включаем выражение, если оно еще не включено
                        try {
                            if (!prop.expressionEnabled) {
                                prop.expressionEnabled = true;
                            }
                        } catch (e) {
                            // Игнорируем ошибки включения
                        }
                        
                        targetProps.push({
                            prop: prop,
                            path: layer.name + " > " + propertyName,
                            parent: null,
                            layer: layer // Сохраняем ссылку на слой
                        });
                        layersWithExpressions.push(layer); // Добавляем слой в список
                        $.writeln("  Найдено свойство с выражением: " + layer.name + " > " + propertyName);
                    }
                }
            } catch (e) {
                $.writeln("    Ошибка при поиске свойства у слоя " + layer.name + ": " + e.message);
            }
        }
        
        $.writeln("=== СОБРАНО СВОЙСТВ: " + targetProps.length + " ===");
        
        if (targetProps.length > 0) {
            $.writeln("Раскрываем " + targetProps.length + " свойств с выражениями...");
            // Передаем слои для выделения в applyRevealHack
            // Выделение произойдет ПОСЛЕ создания ошибок, чтобы команда видела только наши ошибки
            applyRevealHack(targetProps, layersWithExpressions);
        } else {
            $.writeln("⚠ Свойств с выражениями не найдено для раскрытия");
        }
    }
    
    // Функция для раскрытия всех свойств с выражениями
    function revealExpressionProperties(layers) {
        if (!layers || layers.length === 0) {
            $.writeln("revealExpressionProperties: нет слоев для обработки");
            return;
        }
        
        var targetProps = [];
        var layersWithExpressions = {}; // Объект для отслеживания слоев с выражениями
        
        // Рекурсивный поиск свойств с выражениями
        function collectExpressionProps(propGroup, path, layer) {
            try {
                if (!propGroup || propGroup.numProperties === undefined) return;
                
                for (var i = 1; i <= propGroup.numProperties; i++) {
                    try {
                        var prop = propGroup.property(i);
                        var currentPath = path + " > " + prop.name;
                        
                        // Проверяем наличие выражения (без проверки expressionEnabled, т.к. оно может быть еще не включено)
                        if (prop.canSetExpression) {
                            var expr = prop.expression;
                            if (expr && expr !== "") {
                                // Включаем выражение, если оно еще не включено
                                try {
                                    if (!prop.expressionEnabled) {
                                        prop.expressionEnabled = true;
                                    }
                                } catch (e) {
                                    // Игнорируем ошибки включения
                                }
                                
                                targetProps.push({
                                    prop: prop,
                                    path: currentPath,
                                    parent: propGroup,
                                    layer: layer // Сохраняем ссылку на слой
                                });
                                layersWithExpressions[layer.name] = layer; // Отмечаем слой как имеющий выражения
                                $.writeln("    Найдено свойство с выражением: " + currentPath);
                            }
                        }
                        
                        if (prop.numProperties > 0) {
                            collectExpressionProps(prop, currentPath, layer);
                        }
                    } catch (e) {
                        // Пропускаем свойства, к которым нет доступа
                    }
                }
            } catch (e) {
                // Игнорируем ошибки
            }
        }
        
        $.writeln("=== НАЧАЛО СБОРА СВОЙСТВ С ВЫРАЖЕНИЯМИ ===");
        $.writeln("Обрабатываем " + layers.length + " слоев");
        
        // Собираем свойства с выражениями для всех слоев
        for (var l = 0; l < layers.length; l++) {
            var layer = layers[l];
            if (!layer) continue;
            
            $.writeln("  Сканируем слой: " + layer.name);
            try {
                collectExpressionProps(layer, layer.name, layer);
                
                // Обрабатываем эффекты
                if (layer.effects != null) {
                    try {
                        for (var e = 1; e <= layer.effects.numProperties; e++) {
                            var effect = layer.effects.property(e);
                            collectExpressionProps(effect, effect.name, layer);
                        }
                    } catch (e) {
                        // Игнорируем ошибки при доступе к эффектам
                    }
                }
            } catch (e) {
                $.writeln("    Ошибка при сканировании слоя: " + e.message);
            }
        }
        
        $.writeln("=== СОБРАНО СВОЙСТВ: " + targetProps.length + " ===");
        
        if (targetProps.length > 0) {
            $.writeln("Раскрываем " + targetProps.length + " свойств с выражениями...");
            // Преобразуем объект layersWithExpressions в массив
            var layersToSelect = [];
            for (var layerName in layersWithExpressions) {
                layersToSelect.push(layersWithExpressions[layerName]);
            }
            // Передаем слои для выделения в applyRevealHack
            // Выделение произойдет ПОСЛЕ создания ошибок, чтобы команда видела только наши ошибки
            applyRevealHack(targetProps, layersToSelect);
        } else {
            $.writeln("⚠ Свойств с выражениями не найдено для раскрытия");
        }
    }
    
    function applyRevealHack(targetProps, layersToSelect) {
        $.writeln("=== НАЧАЛО ПРИМЕНЕНИЯ ХАКА РАСКРЫТИЯ/ПОКАЗА СВОЙСТВ ЧЕРЕЗ СОЗДАНИЕ ВРЕМЕННОЙ ОШИБКИ ВЫРАЖЕНИЯ (который я нашел на creativecow.net) ===");
        $.writeln("Свойств для обработки: " + targetProps.length);
        
        // КРИТИЧЕСКИЙ ФИКС: Сначала снимаем выделение со ВСЕХ слоев композиции
        var comp = app.project.activeItem;
        try {
            for (var i = 1; i <= comp.numLayers; i++) {
                comp.layer(i).selected = false;
            }
            $.writeln("Шаг 0: Снято выделение со всех слоев композиции");
        } catch(e) {
            $.writeln("Шаг 0: Ошибка при снятии выделения: " + e.message);
        }
        
        // КРИТИЧЕСКИЙ ФИКС: Собираем ВСЕ свойства с выражениями на выделенных слоях
        // и временно отключаем их, чтобы команда видела только наши ошибки
        var allPropsToDisable = [];
        var disabledProps = [];
        
        if (layersToSelect && layersToSelect.length > 0) {
            $.writeln("Шаг 0.5: Собираем все свойства с выражениями на выделенных слоях для временного отключения...");
            
            function collectAllExpressionProps(propGroup, path, layer, targetPropsSet) {
                try {
                    if (!propGroup || propGroup.numProperties === undefined) return;
                    
                    for (var i = 1; i <= propGroup.numProperties; i++) {
                        try {
                            var prop = propGroup.property(i);
                            var currentPath = path + " > " + prop.name;
                            
                            // Проверяем, не является ли это свойство одним из наших целевых
                            var isTargetProp = false;
                            for (var t = 0; t < targetProps.length; t++) {
                                if (targetProps[t].prop === prop) {
                                    isTargetProp = true;
                                    break;
                                }
                            }
                            
                            // Если это свойство с выражением, но НЕ наше целевое - отключаем его
                            if (!isTargetProp && prop.canSetExpression) {
                                var expr = prop.expression;
                                if (expr && expr !== "") {
                                    try {
                                        var enabledState = prop.expressionEnabled;
                                        if (enabledState) {
                                            allPropsToDisable.push({
                                                prop: prop,
                                                path: currentPath,
                                                originalEnabled: enabledState
                                            });
                                        }
                                    } catch (e) {
                                        // Игнорируем ошибки
                                    }
                                }
                            }
                            
                            if (prop.numProperties > 0) {
                                collectAllExpressionProps(prop, currentPath, layer, targetPropsSet);
                            }
                        } catch (e) {
                            // Пропускаем свойства, к которым нет доступа
                        }
                    }
                } catch (e) {
                    // Игнорируем ошибки
                }
            }
            
            // Создаем Set для быстрой проверки целевых свойств
            var targetPropsSet = {};
            for (var t = 0; t < targetProps.length; t++) {
                targetPropsSet[targetProps[t].prop] = true;
            }
            
            for (var l = 0; l < layersToSelect.length; l++) {
                var layer = layersToSelect[l];
                try {
                    collectAllExpressionProps(layer, layer.name, layer, targetPropsSet);
                    
                    if (layer.effects != null) {
                        try {
                            for (var e = 1; e <= layer.effects.numProperties; e++) {
                                var effect = layer.effects.property(e);
                                collectAllExpressionProps(effect, effect.name, layer, targetPropsSet);
                            }
                        } catch (e) {
                            // Игнорируем ошибки
                        }
                    }
                } catch (e) {
                    // Игнорируем ошибки
                }
            }
            
            $.writeln("  Найдено " + allPropsToDisable.length + " свойств с выражениями для временного отключения");
            
            // Временно отключаем все выражения, кроме наших целевых
            for (var d = 0; d < allPropsToDisable.length; d++) {
                try {
                    var item = allPropsToDisable[d];
                    item.prop.expressionEnabled = false;
                    disabledProps.push(item);
                    $.writeln("  Отключено: " + item.path);
                } catch (e) {
                    $.writeln("  Ошибка при отключении " + item.path + ": " + e.message);
                }
            }
        }
        
        var originalExpressions = [];
        var originalEnabled = [];
        
        // Шаг 1: Создаем временные ошибки ТОЛЬКО на нужных свойствах
        $.writeln("Шаг 1: Создаем временные ошибки ТОЛЬКО на нужных свойствах...");
        for (var i = 0; i < targetProps.length; i++) {
            try {
                var prop = targetProps[i].prop;
                var originalExpr = prop.expression;
                var originalEnabledState = false;
                try {
                    originalEnabledState = prop.expressionEnabled;
                } catch (e) {
                    originalEnabledState = true; // По умолчанию считаем включенным
                }
                
                originalExpressions.push(originalExpr);
                originalEnabled.push(originalEnabledState);
                
                $.writeln("  [" + (i + 1) + "] " + targetProps[i].path + ": '" + originalExpr.substring(0, 30) + "...' -> '1/0'");
                
                // Создаем ошибку выражения
                prop.expression = "1/0";
                prop.expressionEnabled = true;
            } catch (e) {
                $.writeln("  [" + (i + 1) + "] ОШИБКА при установке временной ошибки: " + e.message);
                originalExpressions.push(null);
                originalEnabled.push(null);
            }
        }
        
        // Даем AE время обработать изменения и зарегистрировать ошибки
        $.writeln("Шаг 2: Ждем обработки изменений и регистрации ошибок (200мс)...");
        $.sleep(200);
        
        // Принудительно обновляем композицию, чтобы AE зарегистрировал ошибки
        try {
            if (comp instanceof CompItem) {
                comp.openInViewer();
            }
        } catch (e) {
            // Игнорируем ошибки обновления
        }
        
        $.sleep(100); // Дополнительное время для обработки
        
        // Шаг 3: ВЫДЕЛЯЕМ ТОЛЬКО те слои, на которых мы создали ошибки
        // Это критично - команда увидит только ошибки на выделенных слоях
        if (layersToSelect && layersToSelect.length > 0) {
            $.writeln("Шаг 3: Выделяем " + layersToSelect.length + " слоев с созданными ошибками...");
            for (var i = 0; i < layersToSelect.length; i++) {
                try {
                    layersToSelect[i].selected = true;
                } catch (e) {
                    $.writeln("  Ошибка при выделении слоя: " + e.message);
                }
            }
            $.sleep(50); // Даем время на выделение
        }
        
        // Шаг 4: Запускаем команду раскрытия ошибок выражений
        $.writeln("Шаг 4: Ищем команду 'Reveal Expression Errors'...");
        var cmdId = null;
        try {
            cmdId = app.findMenuCommandId("Reveal Expression Errors");
            if (cmdId) {
                $.writeln("  ✓ Команда найдена, ID: " + cmdId);
            } else {
                $.writeln("  ✗ Команда не найдена");
            }
        } catch (e) {
            $.writeln("  ✗ Ошибка при поиске команды: " + e.message);
        }
        
        if (cmdId) {
            try {
                $.writeln("Шаг 5: Выполняем команду раскрытия...");
                app.executeCommand(cmdId);
                $.writeln("  ✓ Команда выполнена");
            } catch (e) {
                $.writeln("  ✗ Ошибка при выполнении команды: " + e.message);
            }
        } else {
            $.writeln("  ⚠ Команда не найдена, пробуем альтернативные варианты...");
            // Пробуем альтернативные названия команды
            var altNames = [
                "Reveal Expression Error",
                "Show Expression Errors",
                "Reveal Errors"
            ];
            for (var a = 0; a < altNames.length; a++) {
                try {
                    var altCmdId = app.findMenuCommandId(altNames[a]);
                    if (altCmdId) {
                        $.writeln("  ✓ Найдена альтернативная команда: " + altNames[a] + " (ID: " + altCmdId + ")");
                        app.executeCommand(altCmdId);
                        $.writeln("  ✓ Альтернативная команда выполнена");
                        break;
                    }
                } catch (e) {
                    // Продолжаем поиск
                }
            }
        }
        
        // Ждем обновления UI после раскрытия
        $.writeln("Шаг 6: Ждем обновления UI после раскрытия (300мс)...");
        $.sleep(300);
        
        // Шаг 7: Восстанавливаем оригинальные выражения
        $.writeln("Шаг 7: Восстанавливаем оригинальные выражения...");
        var restoredCount = 0;
        for (var i = 0; i < targetProps.length; i++) {
            try {
                var prop = targetProps[i].prop;
                if (originalExpressions[i] !== null) {
                    prop.expression = originalExpressions[i];
                    try {
                        prop.expressionEnabled = originalEnabled[i];
                    } catch (e) {
                        // Игнорируем ошибки установки expressionEnabled
                    }
                    restoredCount++;
                }
            } catch (e) {
                $.writeln("  [" + (i + 1) + "] ОШИБКА при восстановлении: " + e.message);
            }
        }
        $.writeln("  ✓ Восстановлено " + restoredCount + " из " + targetProps.length + " выражений");
        
        // Шаг 8: Восстанавливаем отключенные выражения
        if (disabledProps.length > 0) {
            $.writeln("Шаг 8: Восстанавливаем отключенные выражения (" + disabledProps.length + " свойств)...");
            for (var d = 0; d < disabledProps.length; d++) {
                try {
                    var item = disabledProps[d];
                    item.prop.expressionEnabled = item.originalEnabled;
                } catch (e) {
                    $.writeln("  Ошибка при восстановлении " + item.path + ": " + e.message);
                }
            }
            $.writeln("  ✓ Восстановлено " + disabledProps.length + " отключенных выражений");
        }
        
        // Шаг 9: Снимаем выделение
        if (layersToSelect && layersToSelect.length > 0) {
            $.writeln("Шаг 9: Снимаем выделение...");
            for (var i = 0; i < layersToSelect.length; i++) {
                try {
                    layersToSelect[i].selected = false;
                } catch (e) {
                    // Игнорируем ошибки
                }
            }
        }
        
        $.writeln("=== ЗАВЕРШЕНО ПРИМЕНЕНИЕ ХАКА ===");
    }

    function clearExpressionsRecursive(property) {
        try {
            if (property.canSetExpression) property.expression = "";
            if (property.numProperties > 0) {
                for (var i = 1; i <= property.numProperties; i++) {
                    clearExpressionsRecursive(property.property(i));
                }
            }
        } catch (e) {}
    }

    function showMismatchDialog(layerName, mismatchInfo, originalPath, foundPath, hasMoreLayers) {
        var dialog = new Window("dialog", "Несовпадение пути к свойству");
        dialog.orientation = "column";
        dialog.alignChildren = "left";
        // УБРАЛИ предпочтительный размер - окно будет автоматическим
        
        var infoGroup = dialog.add("group");
        infoGroup.orientation = "column";
        infoGroup.alignChildren = "left";
        
        var layerText = infoGroup.add("statictext", undefined, "Слой: " + layerName);
        try {
            layerText.graphics.font = ScriptUI.newFont(layerText.graphics.font.name, ScriptUI.FontStyle.BOLD);
        } catch(e){}
        
        infoGroup.add("statictext", undefined, "");
        infoGroup.add("statictext", undefined, "Обнаружено несовпадение: " + mismatchInfo);
        infoGroup.add("statictext", undefined, "");
        infoGroup.add("statictext", undefined, "Ожидаемый путь:");
        var originalText = infoGroup.add("statictext", undefined, "  " + originalPath.join(" → "));
        try {
            originalText.graphics.font = ScriptUI.newFont(originalText.graphics.font.name, ScriptUI.FontStyle.ITALIC);
        } catch(e){}
        
        infoGroup.add("statictext", undefined, "Найденный путь:");
        var foundText = infoGroup.add("statictext", undefined, "  " + foundPath.join(" → "));
        try {
            foundText.graphics.font = ScriptUI.newFont(foundText.graphics.font.name, ScriptUI.FontStyle.ITALIC);
        } catch(e){}
        
        infoGroup.add("statictext", undefined, "");
        infoGroup.add("statictext", undefined, "Конечное свойство совпадает. Применить выражение?");
        
        var applyToAllCheck = null;
        if (hasMoreLayers) {
            applyToAllCheck = infoGroup.add("checkbox", undefined, "Применить это решение ко всем остальным слоям");
        }
        
        var buttonGroup = dialog.add("group");
        buttonGroup.orientation = "row";
        buttonGroup.alignment = "right";
        
        var applyButton = buttonGroup.add("button", undefined, "Применить", {name: "ok"});
        var skipButton = buttonGroup.add("button", undefined, "Пропустить");
        var abortButton = buttonGroup.add("button", undefined, "Отменить операцию");
        
        applyButton.onClick = function() { dialog.close(1); };
        skipButton.onClick = function() { dialog.close(0); };
        abortButton.onClick = function() { dialog.close(2); };
        
        dialog.center();
        var result = dialog.show();
        
        return {
            apply: result === 1,
            applyToAll: applyToAllCheck ? applyToAllCheck.value : false,
            abort: result === 2
        };
    }

})(this);
