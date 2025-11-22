(function propertyExpressionTool(thisObj) {
    // ===== ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА =====
    var LANGUAGE = "EN"; // "RU" или "EN"
    
    // ===== СЛОВАРЬ ПЕРЕВОДОВ =====
    var translations = {
        RU: {
            // UI элементы
            windowTitle: "Expression2Layers v1.2",
            expressionText: "Текст выражения:",
            getCustomProperty: "Получить кастомное свойство",
            writeExpression: "ЗАПИСАТЬ ВЫРАЖЕНИЕ в выбранные слои",
            clearAllExpressions: "ОЧИСТИТЬ ВСЕ ВЫРАЖЕНИЯ в выбранных слоях",
            expressionSnapshots: "Снимки выражений",
            writingExpressions: "Запись выражений",
            showSelectedPropertyExpression: "Показать выражение выбранного свойства",
            showOnlyWithExpressions: "Показывать только свойства с выражениями",
            checkPropertyMismatches: "Проверить несовпадения свойств",
            checkPropertyMatches: "Проверить совпадения свойств",
            showMismatches: "Показывать несовпадения",
            mismatchesFound: "Найдены несовпадения",
            matchesFound: "Найдены совпадения",
            mismatchesList: "Слои с несовпадающими путями к свойству:",
            matchesList: "Слои с совпадающими путями к свойству:",
            expectedPath: "Ожидаемый путь:",
            selectLayer: "Выделить слой",
            selectLayerFromList: "Выберите слой из списка",
            noMismatches: "Несовпадений не найдено. Все слои имеют одинаковый путь к свойству.",
            noMatches: "Совпадений не найдено. Все слои имеют разные пути к свойству.",
            fullSnapshot: "ПОЛНЫЙ снимок (Все свойства)",
            saveSnapshot: "Сохранить снимок:",
            restoreSnapshot: "Восстановить снимок:",
            selectProperty: "(выберите свойство)",
            noSnapshot: "(нет снимка)",
            saveFullSnapshot: "Сохранить ПОЛНЫЙ снимок (Все свойства)",
            restoreFullSnapshot: "Восстановить ПОЛНЫЙ снимок",
            layers: "слоев",
            
            // Сообщения об ошибках
            error: "Ошибка",
            selectComposition: "Выберите композицию.",
            selectOneProperty: "Выберите одно свойство.",
            selectAtLeastOneLayer: "Выберите хотя бы один слой.",
            selectPropertyFromList: "Выберите свойство из списка.",
            
            // Сообщения
            selected: "Выбрано: ",
            expressionEmpty: "Выражение пустое или содержит только пробелы.\n\nОК - УДАЛИТЬ существующие выражения\nОтмена - оставить без изменений",
            operationCancelled: "Операция отменена. Все изменения откачены.",
            someLayersSkipped: "Некоторые слои пропущены:\n",
            expressionApplied: "Выражение успешно применено.",
            expressionsCleared: "Выражения очищены.",
            clearAllConfirm: "Очистить ВСЕ выражения у ",
            layersQuestion: " слоев?",
            cleared: "Очищено ",
            layersCount: " слоев.",
            
            // Снимки
            snapshotSaved: "Снимок сохранен: ",
            layersFrom: " из ",
            fullSnapshotSaved: "Полный снимок сохранен для ",
            noFullSnapshot: "Нет сохраненного полного снимка.",
            noSnapshotData: "В снимке нет данных для восстановления.",
            noPropertySnapshot: "Нет сохраненного снимка для свойства.",
            restoreFullConfirm: "Восстановить ВСЕ выражения из полного снимка?\nЭто перезапишет текущие выражения!",
            restored: "Восстановлено ",
            expressions: " выражений.",
            layersWithErrors: " слоев с ошибками выделены в композиции.",
            layersWithProblems: " слоев с проблемами выделены в композиции.",
            
            // Предупреждения
            warning: "⚠️ ВНИМАНИЕ:",
            layersWithoutProperty: "Следующие слои не имеют свойства '",
            orNotSupports: "'\nили оно не поддерживает выражения:\n\n",
            possibleReasons: "Возможные причины:\n",
            layerTypeNotSupports: "- Тип слоя не поддерживает это свойство\n",
            propertyDeleted: "- Свойство было удалено\n",
            notSupportsExpressions: "- Свойство не поддерживает выражения\n\n",
            continueForOthers: "Продолжить запись выражения для остальных слоев?",
            layersFromSnapshotNotFound: "Следующие слои из снимка не найдены:\n",
            continueRestore: "Продолжить восстановление для остальных слоев?",
            layersFromSnapshotProblems: "Следующие слои из снимка имеют проблемы:\n",
            effectDeleted: "- Эффект/свойство был удален\n",
            layerRenamed: "- Слой был переименован\n",
            effectsOrderChanged: "- Порядок эффектов изменился\n\n",
            
            // Диалог несовпадения
            layer: "Слой: ",
            mismatchDetected: "Обнаружено несовпадение: ",
            expectedPath: "Ожидаемый путь:",
            foundPath: "Найденный путь:",
            finalPropertyMatches: "Конечное свойство совпадает. Применить выражение?",
            apply: "Применить",
            skip: "Пропустить",
            abortOperation: "Отменить операцию",
            applyToAll: "Применить это решение ко всем остальным слоям",
            
            // Ошибки свойств
            customPropertyNeeded: "Для кастомного свойства нужно сначала нажать 'Get Custom Property'.\nИли выбранное свойство больше не существует.",
            errorSavingPath: "Ошибка при сохранении пути к свойству.",
            propertyNotFound: " (свойство не найдено)",
            propertyNotSupports: " (свойство не поддерживает выражения)",
            accessError: " (ошибка доступа к свойству: ",
            skippedMismatch: " (пропущен из-за несовпадения)",
            error: " (ошибка)",
            layerNotFound: " (слой не найден в композиции)",
            checkError: " (ошибка проверки)",
            expressionRestored: "Восстановлено выражение: ",
            layersFromSnapshotProblems: "Следующие слои из снимка имеют проблемы:\n",
            possibleReasonsRestore: "Возможные причины:\n",
            effectDeletedRestore: "- Эффект/свойство был удален\n",
            layerRenamedRestore: "- Слой был переименован\n",
            effectsOrderChangedRestore: "- Порядок эффектов изменился\n\n",
            continueRestoreOthers: "Продолжить восстановление для остальных слоев?",
            propertyNoLongerExists: "Ошибка: выбранное свойство больше не существует.",
            
            // Тултипы
            tooltipGetCustomProperty: "1. Выберите свойство слоя (например, Slider Control -> Slider)\n\n2. Нажмите Get Custom...",
            tooltipWriteExpression: "1. Выберите свойство из списка выше.\n\n2. Выделите слои.\n\n3. Нажмите WRITE.",
            tooltipClearAllExpressions: "1. Выделите слои\n\n2. Нажмите CLEAR",
            tooltipSaveSnapshot: "Сделает снимок текущего состояния выражений выбранного свойства у всех выделенных слоев.\n\n1. Выберите свойство из списка слева.\n\n2. Выделите слои.\n\n3. Нажмите Save Snapshot.",
            tooltipRestoreSnapshot: "Восстановит все закэшированные кнопкой Save Snapshot выражения.\n\nНажмите, чтобы восстановить из кэша.",
            tooltipFullSnapshotEnabled: "ВКЛЮЧЕН - сделать снимок выражений всех свойств всех слоев в композиции",
            tooltipFullSnapshotDisabled: "ВЫКЛЮЧЕН - сделать снимок выражений выбранного свойства у всех выделенных слоев",
            tooltipShowSelectedPropertyExpression: "Покажет какие выражения применены к выбранным свойствам всех выделенных слоев\n\n1. Выберите свойство из списка слева.\n\n2. Выделите слои.\n\n3. Нажмите Show Selected Property Expression.",
            tooltipShowOnlyWithExpressionsEnabled: "ВКЛЮЧЕН - показывает только свойства у которых есть выражения",
            tooltipShowOnlyWithExpressionsDisabled: "ВЫКЛЮЧЕН - показывает все выбранные свойства",
            tooltipCheckPropertyMismatches: "Покажет, в каких слоях одни и те же свойства имеют другие пути, названия\n\n1. Выберите свойство из списка слева.\n\n2. Выделите слои.\n\n3. Нажмите Check Property Mismatches.",
            tooltipCheckPropertyMatches: "Покажет, в каких слоях одни и те же свойства имеют одинаковые пути, названия\n\n1. Выберите свойство из списка слева.\n\n2. Выделите слои.\n\n3. Нажмите Check Property Matches.",
            tooltipShowMismatchesEnabled: "ВКЛЮЧЕН - показать несовпадающие свойства",
            tooltipShowMismatchesDisabled: "ВЫКЛЮЧЕН - показать совпадающие свойства"
        },
        EN: {
            // UI elements
            windowTitle: "Expression2Layers v1.2",
            expressionText: "Expression Text:",
            getCustomProperty: "Get Custom Property",
            writeExpression: "WRITE EXPRESSION to Selected Layers",
            clearAllExpressions: "CLEAR ALL EXPRESSIONS from Selected Layers",
            expressionSnapshots: "Expression Snapshots",
            writingExpressions: "Writing Expressions",
            showSelectedPropertyExpression: "Show Selected Property Expression",
            showOnlyWithExpressions: "Show only properties with expressions",
            checkPropertyMismatches: "Check Property Mismatches",
            checkPropertyMatches: "Check Property Matches",
            showMismatches: "Show mismatches",
            mismatchesFound: "Mismatches Found",
            matchesFound: "Matches Found",
            mismatchesList: "Layers with mismatched property paths:",
            matchesList: "Layers with matching property paths:",
            expectedPath: "Expected path:",
            selectLayer: "Select Layer",
            selectLayerFromList: "Select a layer from the list",
            noMismatches: "No mismatches found. All layers have the same property path.",
            noMatches: "No matches found. All layers have different property paths.",
            fullSnapshot: "FULL Snapshot (All Properties)",
            saveSnapshot: "Save Snapshot:",
            restoreSnapshot: "Restore Snapshot:",
            selectProperty: "(select property)",
            noSnapshot: "(no snapshot)",
            saveFullSnapshot: "Save FULL Snapshot (All Properties)",
            restoreFullSnapshot: "Restore FULL Snapshot",
            layers: "layers",
            
            // Error messages
            error: "Error",
            selectComposition: "Select a composition.",
            selectOneProperty: "Select one property.",
            selectAtLeastOneLayer: "Select at least one layer.",
            selectPropertyFromList: "Select a property from the list.",
            
            // Messages
            selected: "Selected: ",
            expressionEmpty: "Expression is empty or contains only spaces.\n\nOK - DELETE existing expressions\nCancel - leave unchanged",
            operationCancelled: "Operation cancelled. All changes rolled back.",
            someLayersSkipped: "Some layers were skipped:\n",
            expressionApplied: "Expression successfully applied.",
            expressionsCleared: "Expressions cleared.",
            clearAllConfirm: "Clear ALL expressions from ",
            layersQuestion: " layers?",
            cleared: "Cleared ",
            layersCount: " layers.",
            
            // Snapshots
            snapshotSaved: "Snapshot saved: ",
            layersFrom: " from ",
            fullSnapshotSaved: "Full snapshot saved for ",
            noFullSnapshot: "No saved full snapshot.",
            noSnapshotData: "No data in snapshot to restore.",
            noPropertySnapshot: "No saved snapshot for property.",
            restoreFullConfirm: "Restore ALL expressions from full snapshot?\nThis will overwrite current expressions!",
            restored: "Restored ",
            expressions: " expressions.",
            layersWithErrors: " layers with errors are selected in composition.",
            layersWithProblems: " layers with problems are selected in composition.",
            
            // Warnings
            warning: "⚠️ WARNING:",
            layersWithoutProperty: "The following layers do not have property '",
            orNotSupports: "'\nor it does not support expressions:\n\n",
            possibleReasons: "Possible reasons:\n",
            layerTypeNotSupports: "- Layer type does not support this property\n",
            propertyDeleted: "- Property was deleted\n",
            notSupportsExpressions: "- Property does not support expressions\n\n",
            continueForOthers: "Continue writing expression for other layers?",
            layersFromSnapshotNotFound: "The following layers from snapshot were not found:\n",
            continueRestore: "Continue restoration for other layers?",
            layersFromSnapshotProblems: "The following layers from snapshot have problems:\n",
            effectDeleted: "- Effect/property was deleted\n",
            layerRenamed: "- Layer was renamed\n",
            effectsOrderChanged: "- Effects order changed\n\n",
            
            // Mismatch dialog
            layer: "Layer: ",
            mismatchDetected: "Mismatch detected: ",
            expectedPath: "Expected path:",
            foundPath: "Found path:",
            finalPropertyMatches: "Final property matches. Apply expression?",
            apply: "Apply",
            skip: "Skip",
            abortOperation: "Abort Operation",
            applyToAll: "Apply this decision to all remaining layers",
            
            // Property errors
            customPropertyNeeded: "For custom property, first click 'Get Custom Property'.\nOr selected property no longer exists.",
            errorSavingPath: "Error saving property path.",
            propertyNotFound: " (property not found)",
            propertyNotSupports: " (property does not support expressions)",
            accessError: " (property access error: ",
            skippedMismatch: " (skipped due to mismatch)",
            error: " (error)",
            layerNotFound: " (layer not found in composition)",
            checkError: " (check error)",
            expressionRestored: "Expression restored: ",
            layersFromSnapshotProblems: "The following layers from snapshot have problems:\n",
            possibleReasonsRestore: "Possible reasons:\n",
            effectDeletedRestore: "- Effect/property was deleted\n",
            layerRenamedRestore: "- Layer was renamed\n",
            effectsOrderChangedRestore: "- Effects order changed\n\n",
            continueRestoreOthers: "Continue restoration for other layers?",
            propertyNoLongerExists: "Error: selected property no longer exists.",
            
            // Tooltips
            tooltipGetCustomProperty: "1. Select a layer property (e.g., Slider Control -> Slider)\n\n2. Click Get Custom...",
            tooltipWriteExpression: "1. Select a property from the list above.\n\n2. Select layers.\n\n3. Click WRITE.",
            tooltipClearAllExpressions: "1. Select layers\n\n2. Click CLEAR",
            tooltipSaveSnapshot: "Will snapshot the current state of expressions for the selected property on all selected layers.\n\n1. Select a property from the list on the left.\n\n2. Select layers.\n\n3. Click Save Snapshot.",
            tooltipRestoreSnapshot: "Will restore all expressions cached by the Save Snapshot button.\n\nClick to restore from cache.",
            tooltipFullSnapshotEnabled: "ENABLED - snapshot expressions for all properties of all layers in the composition",
            tooltipFullSnapshotDisabled: "DISABLED - snapshot expressions for the selected property on all selected layers",
            tooltipShowSelectedPropertyExpression: "Will show which expressions are applied to the selected properties of all selected layers\n\n1. Select a property from the list on the left.\n\n2. Select layers.\n\n3. Click Show Selected Property Expression.",
            tooltipShowOnlyWithExpressionsEnabled: "ENABLED - shows only properties that have expressions",
            tooltipShowOnlyWithExpressionsDisabled: "DISABLED - shows all selected properties",
            tooltipCheckPropertyMismatches: "Will show in which layers the same properties have different paths, names\n\n1. Select a property from the list on the left.\n\n2. Select layers.\n\n3. Click Check Property Mismatches.",
            tooltipCheckPropertyMatches: "Will show in which layers the same properties have matching paths, names\n\n1. Select a property from the list on the left.\n\n2. Select layers.\n\n3. Click Check Property Matches.",
            tooltipShowMismatchesEnabled: "ENABLED - show mismatched properties",
            tooltipShowMismatchesDisabled: "DISABLED - show matched properties"
        }
    };
    
    // Функция для получения перевода
    function t(key) {
        return translations[LANGUAGE][key] || key;
    }
    
    // ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
    var selectedProperty = null;
    var expressionsCache = []; // Для отмены текущей операции
    var expressionSnapshot = {}; // Долгосрочный снимок выражений
    var mismatchWindow = null; // Ссылка на окно с несовпадениями
    
    // Управление окном
    if (thisObj.propertyExpressionToolWindow && !thisObj.propertyExpressionToolWindow.closed) {
        thisObj.propertyExpressionToolWindow.show();
        return;
    }

    // СОЗДАНИЕ UI (увеличена ширина на 1/4)
    var scriptWindow = new Window("palette", t("windowTitle"), undefined, {resizeable: true});
    scriptWindow.orientation = "column";
    
    // Переключатель языка
    var languageGroup = scriptWindow.add("group");
    languageGroup.orientation = "row";
    languageGroup.alignment = "right";
    languageGroup.add("statictext", undefined, "Language / Язык: ");
    var languageDropdown = languageGroup.add("dropdownlist", undefined, ["RU", "EN"]);
    languageDropdown.selection = (LANGUAGE === "EN") ? 1 : 0;
    languageDropdown.onChange = function() {
        LANGUAGE = (languageDropdown.selection.index === 1) ? "EN" : "RU";
        // Обновляем все тексты в UI
        scriptWindow.text = t("windowTitle");
        expressionGroup.children[0].text = t("expressionText");
        leftPanel.text = t("writingExpressions");
        getPropertyButton.text = t("getCustomProperty");
        writeExpressionButton.text = t("writeExpression");
        clearAllExpressionsButton.text = t("clearAllExpressions");
        rightPanel.text = t("expressionSnapshots");
        showPropertyPanel.text = t("showSelectedPropertyExpression");
        showPropertyExpressionButton.text = t("showSelectedPropertyExpression");
        showOnlyWithExpressionsCheckbox.text = t("showOnlyWithExpressions");
        checkMismatchesPanel.text = t("checkPropertyMismatches");
        // Обновляем название кнопки в зависимости от состояния чекбокса
        if (showMismatchesCheckbox.value) {
            checkMismatchesButton.text = t("checkPropertyMismatches");
        } else {
            checkMismatchesButton.text = t("checkPropertyMatches");
        }
        showMismatchesCheckbox.text = t("showMismatches");
        fullSnapshotCheckbox.text = t("fullSnapshot");
        updateSnapshotButtonLabels();
        updateTooltips(); // Обновляем все тултипы при смене языка
        
        // Обновляем тексты в окне с несовпадениями, если оно открыто
        if (mismatchWindow && !mismatchWindow.closed) {
            // Определяем заголовок окна в зависимости от режима
            var showMismatches = showMismatchesCheckbox ? showMismatchesCheckbox.value : true;
            mismatchWindow.text = showMismatches ? t("mismatchesFound") : t("matchesFound");
            if (mismatchWindow.mismatchesListText) {
                mismatchWindow.mismatchesListText.text = showMismatches ? t("mismatchesList") : t("matchesList");
            }
            if (mismatchWindow.expectedPathText && mismatchWindow.expectedPathDisplay) {
                mismatchWindow.expectedPathText.text = t("expectedPath") + " " + mismatchWindow.expectedPathDisplay;
            }
            if (mismatchWindow.selectLayerButton) {
                mismatchWindow.selectLayerButton.text = t("selectLayer");
            }
        }
    };

    // Поле ввода выражения (на всю ширину)
    var expressionGroup = scriptWindow.add("group");
    expressionGroup.orientation = "column";
    expressionGroup.add("statictext", undefined, t("expressionText"));
    var expressionInput = expressionGroup.add("edittext", undefined, "", {multiline: true});
    
    // Ширина поля ввода и панелей должна совпадать
    var expressionInputWidth = 750;
    expressionInput.size = [expressionInputWidth, 300]; // Увеличено с 600 до 750 (600 * 1.25)

    // Две панели: левая и правая (правая с третьей панелью под ней)
    // Ширина панелей должна быть такой, чтобы: левая панель + отступ между панелями + правая панель = ширина поля ввода
    var panelsGroup = scriptWindow.add("group");
    panelsGroup.orientation = "row";
    panelsGroup.alignment = "fill";
    panelsGroup.alignChildren = "fill";
    
    // Отступ между панелями
    var panelSpacing = 10;
    // Ширина каждой панели (одинаковая для обеих)
    var panelWidth = (expressionInputWidth - panelSpacing) / 2;
    
    // ЛЕВАЯ ПАНЕЛЬ
    var leftPanel = panelsGroup.add("panel", undefined, t("writingExpressions"));
    leftPanel.orientation = "column";
    leftPanel.alignment = "fill";
    leftPanel.alignChildren = "fill";
    leftPanel.margins = [0, 10, 0, 10]; // Отступы: [left, top, right, bottom]
    leftPanel.preferredSize.width = panelWidth; // Фиксированная ширина панели
    
    // Внутренняя группа с отступами для элементов левой панели
    var leftPanelContent = leftPanel.add("group");
    leftPanelContent.orientation = "column";
    leftPanelContent.alignment = "fill";
    leftPanelContent.alignChildren = "center"; // Центрирование элементов по горизонтали
    leftPanelContent.margins = [10, 0, 10, 0]; // Отступы слева и справа
    
    // Стандартная ширина для всех элементов внутри панелей
    var panelButtonWidth = 345;
    
    var getPropertyButton = leftPanelContent.add("button", undefined, t("getCustomProperty"));
    getPropertyButton.size = [panelButtonWidth, 35]; // Высота выровнена по кнопкам Save/Restore Snapshot
    getPropertyButton.helpTip = t("tooltipGetCustomProperty");
    
    var propertyList = leftPanelContent.add("listbox", undefined, ["Position", "Scale", "Rotation", "Opacity", "Anchor Point"]);
    propertyList.size = [panelButtonWidth, 150];

    // КНОПКИ ОСНОВНЫХ ОПЕРАЦИЙ (в левой панели)
    var writeExpressionButton = leftPanelContent.add("button", undefined, t("writeExpression"));
    writeExpressionButton.size = [panelButtonWidth, 75];
    writeExpressionButton.helpTip = t("tooltipWriteExpression");
    
    var clearAllExpressionsButton = leftPanelContent.add("button", undefined, t("clearAllExpressions"));
    clearAllExpressionsButton.size = [panelButtonWidth, 50];
    clearAllExpressionsButton.helpTip = t("tooltipClearAllExpressions");

    // ГРУППА ДЛЯ ПРАВОЙ СТОРОНЫ (правая панель + третья панель под ней)
    var rightPanelsGroup = panelsGroup.add("group");
    rightPanelsGroup.orientation = "column";
    rightPanelsGroup.alignment = "fill";
    rightPanelsGroup.alignChildren = "fill";
    rightPanelsGroup.margins = [panelSpacing, 0, 0, 0]; // Отступ слева для разделения с левой панелью
    
    // ПРАВАЯ ПАНЕЛЬ
    var rightPanel = rightPanelsGroup.add("panel", undefined, t("expressionSnapshots"));
    rightPanel.orientation = "column";
    rightPanel.alignment = "fill";
    rightPanel.alignChildren = "fill";
    rightPanel.margins = [0, 10, 0, 10]; // Отступы: [left, top, right, bottom]
    rightPanel.preferredSize.width = panelWidth; // Фиксированная ширина панели
    
    // Внутренняя группа с отступами для элементов правой панели
    var rightPanelContent = rightPanel.add("group");
    rightPanelContent.orientation = "column";
    rightPanelContent.alignment = "fill";
    rightPanelContent.alignChildren = "center"; // Центрирование элементов по горизонтали
    rightPanelContent.margins = [10, 0, 10, 0]; // Отступы слева и справа
    
    var saveSnapshotButton = rightPanelContent.add("button", undefined, t("saveSnapshot") + " " + t("selectProperty"));
    saveSnapshotButton.size = [panelButtonWidth, 35];
    saveSnapshotButton.helpTip = t("tooltipSaveSnapshot");
    
    var restoreSnapshotButton = rightPanelContent.add("button", undefined, t("restoreSnapshot") + " " + t("noSnapshot"));
    restoreSnapshotButton.size = [panelButtonWidth, 35];
    restoreSnapshotButton.helpTip = t("tooltipRestoreSnapshot");
    
    // Чекбокс для выбора режима (FULL Snapshot) - перемещен ниже кнопок, выровнен по левому краю
    var checkboxGroup = rightPanelContent.add("group");
    checkboxGroup.orientation = "row";
    checkboxGroup.alignment = "left";
    checkboxGroup.alignChildren = "left";
    
    var fullSnapshotCheckbox = checkboxGroup.add("checkbox", undefined, t("fullSnapshot"));
    fullSnapshotCheckbox.value = false; // По умолчанию выбранное свойство
    // Тултип обновляется в updateTooltips() в зависимости от состояния
    
    // ТРЕТЬЯ ПАНЕЛЬ - Показ выражений (под правой панелью)
    var showPropertyPanel = rightPanelsGroup.add("panel", undefined, t("showSelectedPropertyExpression"));
    showPropertyPanel.orientation = "column";
    showPropertyPanel.alignment = "fill";
    showPropertyPanel.alignChildren = "fill";
    showPropertyPanel.margins = [0, 10, 0, 10]; // Отступы: без отступа слева, так как уже в группе с правой панелью
    
    // Внутренняя группа с отступами для элементов третьей панели
    var showPropertyPanelContent = showPropertyPanel.add("group");
    showPropertyPanelContent.orientation = "column";
    showPropertyPanelContent.alignment = "fill";
    showPropertyPanelContent.alignChildren = "center"; // Центрирование элементов по горизонтали
    showPropertyPanelContent.margins = [10, 0, 10, 0]; // Отступы слева и справа
    
    var showPropertyExpressionButton = showPropertyPanelContent.add("button", undefined, t("showSelectedPropertyExpression"));
    showPropertyExpressionButton.size = [panelButtonWidth, 35];
    showPropertyExpressionButton.helpTip = t("tooltipShowSelectedPropertyExpression");
    
    // Чекбокс для выбора режима показа (только с выражениями или все)
    var showOnlyWithExpressionsCheckboxGroup = showPropertyPanelContent.add("group");
    showOnlyWithExpressionsCheckboxGroup.orientation = "row";
    showOnlyWithExpressionsCheckboxGroup.alignment = "left";
    showOnlyWithExpressionsCheckboxGroup.alignChildren = "left";
    
    var showOnlyWithExpressionsCheckbox = showOnlyWithExpressionsCheckboxGroup.add("checkbox", undefined, t("showOnlyWithExpressions"));
    showOnlyWithExpressionsCheckbox.value = true; // По умолчанию включен (показывать только с выражениями)
    // Тултип обновляется в updateTooltips() в зависимости от состояния
    
    // Обработчик изменения чекбокса - обновляем тултип
    showOnlyWithExpressionsCheckbox.onClick = function() {
        updateTooltips();
    };
    
    // ЧЕТВЕРТАЯ ПАНЕЛЬ - Проверка несовпадений (под третьей панелью)
    var checkMismatchesPanel = rightPanelsGroup.add("panel", undefined, t("checkPropertyMismatches"));
    checkMismatchesPanel.orientation = "column";
    checkMismatchesPanel.alignment = "fill";
    checkMismatchesPanel.alignChildren = "fill";
    checkMismatchesPanel.margins = [0, 10, 0, 10]; // Отступы: без отступа слева, так как уже в группе с правой панелью
    
    // Внутренняя группа с отступами для элементов четвертой панели
    var checkMismatchesPanelContent = checkMismatchesPanel.add("group");
    checkMismatchesPanelContent.orientation = "column";
    checkMismatchesPanelContent.alignment = "fill";
    checkMismatchesPanelContent.alignChildren = "center"; // Центрирование элементов по горизонтали
    checkMismatchesPanelContent.margins = [10, 0, 10, 0]; // Отступы слева и справа
    
    var checkMismatchesButton = checkMismatchesPanelContent.add("button", undefined, t("checkPropertyMismatches"));
    checkMismatchesButton.size = [panelButtonWidth, 35];
    // Тултип обновляется в updateTooltips() в зависимости от состояния чекбокса
    
    // Чекбокс для выбора режима (несовпадения или совпадения)
    var showMismatchesCheckboxGroup = checkMismatchesPanelContent.add("group");
    showMismatchesCheckboxGroup.orientation = "row";
    showMismatchesCheckboxGroup.alignment = "left";
    showMismatchesCheckboxGroup.alignChildren = "left";
    
    var showMismatchesCheckbox = showMismatchesCheckboxGroup.add("checkbox", undefined, t("showMismatches"));
    showMismatchesCheckbox.value = true; // По умолчанию включен (показывать несовпадения)
    // Тултип обновляется в updateTooltips() в зависимости от состояния
    
    // Обработчик изменения чекбокса - обновляем название кнопки и тултипы
    showMismatchesCheckbox.onClick = function() {
        if (showMismatchesCheckbox.value) {
            checkMismatchesButton.text = t("checkPropertyMismatches");
        } else {
            checkMismatchesButton.text = t("checkPropertyMatches");
        }
        updateTooltips();
    };
    
    // Функция обновления тултипов
    function updateTooltips() {
        // Статические тултипы (не зависят от состояния)
        getPropertyButton.helpTip = t("tooltipGetCustomProperty");
        writeExpressionButton.helpTip = t("tooltipWriteExpression");
        clearAllExpressionsButton.helpTip = t("tooltipClearAllExpressions");
        saveSnapshotButton.helpTip = t("tooltipSaveSnapshot");
        restoreSnapshotButton.helpTip = t("tooltipRestoreSnapshot");
        showPropertyExpressionButton.helpTip = t("tooltipShowSelectedPropertyExpression");
        
        // Динамические тултипы (зависят от состояния чекбоксов)
        if (fullSnapshotCheckbox.value) {
            fullSnapshotCheckbox.helpTip = t("tooltipFullSnapshotEnabled");
        } else {
            fullSnapshotCheckbox.helpTip = t("tooltipFullSnapshotDisabled");
        }
        
        if (showOnlyWithExpressionsCheckbox.value) {
            showOnlyWithExpressionsCheckbox.helpTip = t("tooltipShowOnlyWithExpressionsEnabled");
        } else {
            showOnlyWithExpressionsCheckbox.helpTip = t("tooltipShowOnlyWithExpressionsDisabled");
        }
        
        if (showMismatchesCheckbox.value) {
            checkMismatchesButton.helpTip = t("tooltipCheckPropertyMismatches");
            showMismatchesCheckbox.helpTip = t("tooltipShowMismatchesEnabled");
        } else {
            checkMismatchesButton.helpTip = t("tooltipCheckPropertyMatches");
            showMismatchesCheckbox.helpTip = t("tooltipShowMismatchesDisabled");
        }
    }
    
    // Инициализация тултипов при создании UI
    updateTooltips();
    
    // Подвал с email
    var footerGroup = scriptWindow.add("group");
    footerGroup.orientation = "row";
    footerGroup.alignment = "center";
    footerGroup.margins = [0, 10, 0, 0];
    var footerText = footerGroup.add("statictext", undefined, "tannenspiel@gmail.com");
    try {
        footerText.graphics.font = ScriptUI.newFont(footerText.graphics.font.name, ScriptUI.FontStyle.ITALIC);
    } catch(e){}
    
    scriptWindow.onClose = function () {
        thisObj.propertyExpressionToolWindow = null;
    };

    thisObj.propertyExpressionToolWindow = scriptWindow;
    scriptWindow.center();
    scriptWindow.show();

    // ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ НАЗВАНИЙ КНОПОК
    function updateSnapshotButtonLabels() {
        var isFullMode = fullSnapshotCheckbox.value;
        
        if (isFullMode) {
            // Режим FULL Snapshot
            saveSnapshotButton.text = t("saveFullSnapshot");
            
            var fullCount = Object.keys(expressionSnapshot.data || {}).length;
            if (expressionSnapshot.type === "full" && fullCount > 0) {
                restoreSnapshotButton.text = t("restoreFullSnapshot") + " (" + fullCount + " " + t("layers") + ")";
                restoreSnapshotButton.enabled = true;
            } else {
                restoreSnapshotButton.text = t("restoreFullSnapshot") + " (" + t("fullSnapshot") + ")";
                restoreSnapshotButton.enabled = false;
            }
        } else {
            // Режим выбранного свойства
            var selectedPropertyName = propertyList.selection ? propertyList.selection.text : null;
            if (selectedPropertyName) {
                var displayName = selectedPropertyName.replace(/^Custom: /, "");
                saveSnapshotButton.text = t("saveSnapshot") + " " + displayName;
            } else {
                saveSnapshotButton.text = t("saveSnapshot") + " " + t("selectProperty");
            }
            
            if (expressionSnapshot.type === "selectedProperty" && expressionSnapshot.propertyName) {
                var savedName = expressionSnapshot.propertyName.replace(/^Custom: /, "");
                restoreSnapshotButton.text = t("restoreSnapshot") + " " + savedName;
                restoreSnapshotButton.enabled = true;
            } else {
                restoreSnapshotButton.text = t("restoreSnapshot") + " " + t("noSnapshot");
                restoreSnapshotButton.enabled = false;
            }
        }
    }
    
    // Обработчик изменения чекбокса
    fullSnapshotCheckbox.onClick = function() {
        updateSnapshotButtonLabels();
        updateTooltips(); // Обновляем тултип чекбокса
    };
    
    // Инициализируем названия кнопок при открытии окна
    updateSnapshotButtonLabels();

    // ОБРАБОТЧИКИ КНОПОК

    getPropertyButton.onClick = function () {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert(t("selectComposition"), t("error"));
            return;
        }

        var deepestProp = getDeepestSelectedProperty(comp);
        if (!deepestProp) {
            alert(t("selectOneProperty"), t("error"));
            return;
        }

        selectedProperty = deepestProp;
        
        // Показываем диалог с информацией о выбранном свойстве
        // showPropertySelectedDialog(deepestProp.name); // Закомментировано по запросу пользователя

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
            alert(t("selectComposition"), t("error"));
            return;
        }

        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            alert(t("selectAtLeastOneLayer"), t("error"));
            return;
        }

        var selectedPropertyName = propertyList.selection ? propertyList.selection.text : null;
        if (!selectedPropertyName) {
            alert(t("selectPropertyFromList"), t("error"));
            return;
        }

        // ВАЛИДАЦИЯ выражения
        var expressionText = expressionInput.text;
        var trimmedExpression = expressionText.trim();

        if (!trimmedExpression) {
            if (!confirm(t("expressionEmpty"))) {
                return;
            }
        }

        app.beginUndoGroup("Write Expression");
        expressionsCache = []; // ОЧИЩАЕМ КЭШ перед операцией (!!!)
        var skippedLayers = []; // Массив строк для сообщений
        var skippedLayerObjects = []; // Массив объектов слоев для выделения
        var applyToAllDecision = null;
        var shouldAbort = false;

        // Проверяем, является ли выбранное свойство базовым
        var isBaseProperty = (selectedPropertyName === "Position" || selectedPropertyName === "Scale" ||
                             selectedPropertyName === "Rotation" || selectedPropertyName === "Opacity" ||
                             selectedPropertyName === "Anchor Point");
        
        // ПРЕДВАРИТЕЛЬНАЯ ПРОВЕРКА: собираем слои без нужного свойства
        var layersWithoutProperty = [];
        for (var checkIdx = 0; checkIdx < selectedLayers.length; checkIdx++) {
            var checkLayer = selectedLayers[checkIdx];
            try {
                var checkProperty = null;
                if (isBaseProperty) {
                    try {
                        checkProperty = checkLayer.property(selectedPropertyName);
                        // Проверяем, что свойство существует и может принимать выражения
                        if (!checkProperty || !checkProperty.canSetExpression) {
                            layersWithoutProperty.push(checkLayer.name);
                        }
                    } catch (e) {
                        // Свойство не существует на этом слое
                        layersWithoutProperty.push(checkLayer.name);
                    }
                } else {
                    var checkResult = findPropertyPath(checkLayer, selectedPropertyName);
                    if (!checkResult || !checkResult.property || !checkResult.property.canSetExpression) {
                        layersWithoutProperty.push(checkLayer.name);
                    }
                }
            } catch (e) {
                layersWithoutProperty.push(checkLayer.name + t("checkError"));
            }
        }
        
        // Если есть слои без свойства, показываем диалог
        if (layersWithoutProperty.length > 0) {
            var missingMessage = t("warning") + " " + t("layersWithoutProperty") + selectedPropertyName + t("orNotSupports") +
                                layersWithoutProperty.join("\n") + "\n\n" +
                                t("possibleReasons") +
                                t("layerTypeNotSupports") +
                                t("propertyDeleted") +
                                t("notSupportsExpressions") +
                                t("continueForOthers");
            
            var shouldContinue = confirm(missingMessage);
            if (!shouldContinue) {
                app.endUndoGroup();
                return;
            }
        }
        
        for (var i = 0; i < selectedLayers.length && !shouldAbort; i++) {
            var layer = selectedLayers[i];
            try {
                var property = null;
                var result = null;
                
                if (isBaseProperty) {
                    // Для базовых свойств используем прямой доступ
                    try {
                        property = layer.property(selectedPropertyName);
                        if (!property) {
                            skippedLayers.push(layer.name + t("propertyNotFound"));
                            skippedLayerObjects.push(layer);
                            continue;
                        }
                        // Проверяем, может ли свойство принимать выражения
                        if (!property.canSetExpression) {
                            skippedLayers.push(layer.name + t("propertyNotSupports"));
                            skippedLayerObjects.push(layer);
                            continue;
                        }
                        // Создаем фиктивный result для совместимости
                        result = {
                            property: property,
                            hasMismatch: false
                        };
                    } catch (e) {
                        skippedLayers.push(layer.name + t("accessError") + e.message + ")");
                        skippedLayerObjects.push(layer);
                        continue;
                    }
                } else {
                    // Для кастомных свойств используем findPropertyPath
                    result = findPropertyPath(layer, selectedPropertyName);
                    if (!result || !result.property) {
                        skippedLayers.push(layer.name + t("propertyNotFound"));
                        skippedLayerObjects.push(layer);
                        continue;
                    }
                    property = result.property;
                }
                
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
                                    skippedLayers.push(layer.name + t("skippedMismatch"));
                                    skippedLayerObjects.push(layer);
                                    continue;
                    }
                }
                
                // ПРИМЕНЯЕМ выражение
                if (property.canSetExpression) {
                    property.expression = trimmedExpression;
                    $.writeln(trimmedExpression ? 
                        t("expressionApplied") + ": " + layer.name : 
                        t("expressionsCleared") + ": " + layer.name
                    );
                } else {
                    skippedLayers.push(layer.name + t("propertyNotSupports"));
                    skippedLayerObjects.push(layer);
                }
            } catch (error) {
                $.writeln(t("error") + ": " + layer.name + ": " + error.message);
                skippedLayers.push(layer.name + t("error"));
                skippedLayerObjects.push(layer);
            }
        }

        // КОРРЕКТНАЯ ОТМЕНА: восстанавливаем только из кэша
        if (shouldAbort) {
            for (var j = 0; j < expressionsCache.length; j++) {
                var cache = expressionsCache[j];
                if (cache.property && cache.property.canSetExpression) {
                    cache.property.expression = cache.oldExpression;
                    $.writeln(t("expressionRestored") + cache.layer.name);
                }
            }
            app.endUndoGroup();
            expressionsCache = []; // ОЧИЩАЕМ КЭШ после отмены (!!!)
            
            // Выделяем проблемные слои (если они есть)
            if (skippedLayerObjects.length > 0) {
                deselectAllLayers(comp);
                selectProblemLayers(skippedLayerObjects);
            }
            
            alert(t("operationCancelled"));
            return;
        }

        app.endUndoGroup();
        expressionsCache = []; // ОЧИЩАЕМ КЭШ после успеха (!!!)

        // Выделяем проблемные слои (если они есть)
        if (skippedLayerObjects.length > 0) {
            deselectAllLayers(comp);
            selectProblemLayers(skippedLayerObjects);
        }

        if (skippedLayers.length > 0) {
            alert(t("someLayersSkipped") + skippedLayers.join("\n"));
                } else {
            alert(trimmedExpression ? t("expressionApplied") : t("expressionsCleared"));
        }
    };

    clearAllExpressionsButton.onClick = function () {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert(t("selectComposition"), t("error"));
            return;
        }

        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            alert(t("selectAtLeastOneLayer"), t("error"));
            return;
        }

        if (!confirm(t("clearAllConfirm") + selectedLayers.length + t("layersQuestion"))) {
            return;
        }

        app.beginUndoGroup("Clear All Expressions");
        var clearedLayers = [];

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            try {
                clearExpressionsRecursive(layer);
                clearedLayers.push(layer.name);
                $.writeln(t("expressionsCleared") + ": " + layer.name);
            } catch (error) {
                $.writeln(t("error") + ": " + layer.name + ": " + error.message);
            }
        }

        app.endUndoGroup();
        alert(t("cleared") + clearedLayers.length + t("layersCount"));
    };

    // ===== ПОКАЗ ВЫРАЖЕНИЯ ВЫБРАННОГО СВОЙСТВА =====

    showPropertyExpressionButton.onClick = function () {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert(t("selectComposition"), t("error"));
            return;
        }

        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            alert(t("selectAtLeastOneLayer"), t("error"));
            return;
        }

        var selectedPropertyName = propertyList.selection ? propertyList.selection.text : null;
        if (!selectedPropertyName) {
            alert(t("selectPropertyFromList"), t("error"));
            return;
        }

        // Определяем, является ли выбранное свойство базовым
        var isBaseProperty = (selectedPropertyName === "Position" || selectedPropertyName === "Scale" ||
                             selectedPropertyName === "Rotation" || selectedPropertyName === "Opacity" ||
                             selectedPropertyName === "Anchor Point");
        
        var propertyPath = null; // Для кастомных свойств
        
        if (!isBaseProperty) {
            // Для кастомных свойств нужно получить путь из selectedProperty
            if (!selectedProperty || !isPropertyValid(selectedProperty)) {
                alert(t("customPropertyNeeded"), t("error"));
                return;
            }
            
            // Получаем путь к свойству
            var pathArray = [];
            var prop = selectedProperty;
            
            try {
                var maxIterations = 100;
                var iterations = 0;
                while (prop && iterations < maxIterations) {
                    pathArray.unshift(prop.matchName || prop.name);
                    prop = prop.parentProperty;
                    iterations++;
                }
            } catch (e) {
                alert(t("errorSavingPath"), t("error"));
                return;
            }
            
            pathArray.shift(); // Убираем слой
            propertyPath = pathArray;
        }
        
        // Раскрываем свойство с выражением через хак
        revealExpressionProperty(selectedLayers, selectedPropertyName, isBaseProperty, propertyPath);
    };

    // ===== ПРОВЕРКА НЕСОВПАДЕНИЙ СВОЙСТВ =====

    checkMismatchesButton.onClick = function () {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert(t("selectComposition"), t("error"));
            return;
        }

        // Если не выделены слои - берем все слои композиции
        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            // Берем все слои композиции
            selectedLayers = [];
            for (var allIdx = 1; allIdx <= comp.numLayers; allIdx++) {
                selectedLayers.push(comp.layer(allIdx));
            }
        }
        
        if (selectedLayers.length === 0) {
            alert(t("selectAtLeastOneLayer"), t("error"));
            return;
        }
        
        // Определяем режим работы (несовпадения или совпадения)
        var showMismatches = showMismatchesCheckbox.value;

        var selectedPropertyName = propertyList.selection ? propertyList.selection.text : null;
        if (!selectedPropertyName) {
            alert(t("selectPropertyFromList"), t("error"));
            return;
        }

        // Определяем, является ли выбранное свойство базовым
        var isBaseProperty = (selectedPropertyName === "Position" || selectedPropertyName === "Scale" ||
                             selectedPropertyName === "Rotation" || selectedPropertyName === "Opacity" ||
                             selectedPropertyName === "Anchor Point");
        
        var propertyPath = null; // Для кастомных свойств
        var originalPath = null; // Оригинальный путь для сравнения
        
        if (!isBaseProperty) {
            // Для кастомных свойств нужно получить путь из selectedProperty
            if (!selectedProperty || !isPropertyValid(selectedProperty)) {
                alert(t("customPropertyNeeded"), t("error"));
                return;
            }
            
            // Получаем оригинальный путь к свойству
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
                alert(t("errorSavingPath"), t("error"));
                return;
            }
            
            pathArray.shift(); // Убираем слой
            nameArray.shift();
            propertyPath = pathArray;
            originalPath = nameArray;
        }
        
        // Проверяем несовпадения или совпадения для всех слоев (в зависимости от режима)
        var mismatchedLayers = [];
        var mismatchListItems = []; // Элементы для списка: [имя слоя, путь]
        var expectedPathDisplay = null; // Образцовый путь для отображения
        
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            try {
                var result = null;
                var layerPath = null;
                
                if (isBaseProperty) {
                    // Для базовых свойств несовпадений быть не может, но может отсутствовать свойство
                    try {
                        var property = layer.property(selectedPropertyName);
                        if (!property || !property.canSetExpression) {
                            // Если режим "показывать несовпадения" - добавляем в список
                            if (showMismatches) {
                                mismatchedLayers.push(layer);
                                mismatchListItems.push([layer.name, ""]);
                            }
                        } else {
                            // Если режим "показывать совпадения" - добавляем в список
                            if (!showMismatches) {
                                mismatchedLayers.push(layer);
                                mismatchListItems.push([layer.name, ""]);
                            }
                        }
                    } catch (e) {
                        // Если режим "показывать несовпадения" - добавляем в список
                        if (showMismatches) {
                            mismatchedLayers.push(layer);
                            mismatchListItems.push([layer.name, ""]);
                        }
                    }
                } else {
                    // Для кастомных свойств проверяем путь
                    result = findPropertyPath(layer, selectedPropertyName);
                    if (!result || !result.property) {
                        // Если режим "показывать несовпадения" - добавляем в список
                        if (showMismatches) {
                            mismatchedLayers.push(layer);
                            mismatchListItems.push([layer.name, ""]);
                        }
                    } else if (result.hasMismatch) {
                        // Если режим "показывать несовпадения" - добавляем в список
                        if (showMismatches) {
                            mismatchedLayers.push(layer);
                            // Сохраняем найденный путь (без подписей)
                            layerPath = result.foundPath.join(" → ");
                            mismatchListItems.push([layer.name, layerPath]);
                            // Сохраняем образцовый путь (если еще не сохранен)
                            if (expectedPathDisplay === null) {
                                expectedPathDisplay = result.originalPath.join(" → ");
                            }
                        }
                    } else {
                        // Если режим "показывать совпадения" - добавляем в список
                        if (!showMismatches) {
                            mismatchedLayers.push(layer);
                            // Сохраняем найденный путь (без подписей)
                            layerPath = result.foundPath.join(" → ");
                            mismatchListItems.push([layer.name, layerPath]);
                            // Сохраняем образцовый путь (если еще не сохранен)
                            if (expectedPathDisplay === null) {
                                expectedPathDisplay = result.originalPath.join(" → ");
                            }
                        }
                    }
                }
            } catch (e) {
                // Если режим "показывать несовпадения" - добавляем в список
                if (showMismatches) {
                    mismatchedLayers.push(layer);
                    mismatchListItems.push([layer.name, ""]);
                }
            }
        }
        
        // Если для кастомных свойств не было несовпадений, но есть образцовый путь - используем его
        if (expectedPathDisplay === null && !isBaseProperty && originalPath) {
            expectedPathDisplay = originalPath.join(" → ");
        }
        
        // Находим самое длинное имя слоя и путь для расчета ширины окна
        var maxLayerNameLength = 0;
        var maxPathLength = 0;
        if (mismatchListItems.length > 0) {
            for (var calcIdx = 0; calcIdx < mismatchListItems.length; calcIdx++) {
                var layerNameLen = mismatchListItems[calcIdx][0].length;
                var pathLen = (mismatchListItems[calcIdx][1] || "").length;
                if (layerNameLen > maxLayerNameLength) {
                    maxLayerNameLength = layerNameLen;
                }
                if (pathLen > maxPathLength) {
                    maxPathLength = pathLen;
                }
            }
        }
        
        // Если нет несовпадений/совпадений - показываем alert и выходим
        if (mismatchedLayers.length === 0) {
            var noResultText = showMismatches ? t("noMismatches") : t("noMatches");
            alert(noResultText);
            return;
        }
        
        // Вычисляем ширину на основе длины имен (примерно 8-10 пикселей на символ)
        // Для кириллицы может быть больше, используем коэффициент 10
        var charWidth = 10; // Пикселей на символ (приблизительно)
        var minLayerListWidth = 150; // Минимальная ширина для списка слоев
        var minPathListWidth = 200; // Минимальная ширина для списка путей
        var layersListWidth = Math.max(minLayerListWidth, maxLayerNameLength * charWidth + 40); // +40 для отступов и скроллбара
        var pathsListWidth = Math.max(minPathListWidth, maxPathLength * charWidth + 40); // +40 для отступов и скроллбара
        var totalWindowWidth = layersListWidth + pathsListWidth + 50; // +50 для отступов окна и между списками
        
        // Создаем окно со списком несовпадений
        // Если окно уже открыто, закрываем его перед созданием нового
        if (mismatchWindow && !mismatchWindow.closed) {
            mismatchWindow.close();
        }
        // Определяем заголовок окна в зависимости от режима
        var windowTitle = showMismatches ? t("mismatchesFound") : t("matchesFound");
        mismatchWindow = new Window("palette", windowTitle, undefined, {resizeable: true});
        mismatchWindow.orientation = "column";
        // Устанавливаем динамическую ширину
        mismatchWindow.preferredSize.width = totalWindowWidth;
        
        var infoGroup = mismatchWindow.add("group");
        infoGroup.orientation = "column";
        infoGroup.alignChildren = "left";
            // Первый staticText - заголовок (сохраняем ссылку для обновления)
            var listTitle = showMismatches ? t("mismatchesList") : t("matchesList");
            var mismatchesListText = infoGroup.add("statictext", undefined, listTitle);
            // Устанавливаем динамическую ширину для предотвращения обрезания текста
            try {
                mismatchesListText.preferredSize.width = totalWindowWidth - 20; // -20 для отступов
            } catch(e) {}
            
            // Второй staticText - образцовый путь (сохраняем ссылку для обновления)
            var expectedPathText = null;
            if (expectedPathDisplay) {
                expectedPathText = infoGroup.add("statictext", undefined, t("expectedPath") + " " + expectedPathDisplay);
                // Устанавливаем динамическую ширину для предотвращения обрезания текста
                try {
                    expectedPathText.preferredSize.width = totalWindowWidth - 20; // -20 для отступов
                } catch(e) {}
                try {
                    expectedPathText.graphics.font = ScriptUI.newFont(expectedPathText.graphics.font.name, ScriptUI.FontStyle.ITALIC);
                } catch(e){}
            }
            
            infoGroup.add("statictext", undefined, "");
            
            // Два списка рядом для двух колонок (имя слоя и путь)
            var listsGroup = infoGroup.add("group");
            listsGroup.orientation = "row";
            listsGroup.alignment = "fill";
            listsGroup.alignChildren = "fill";
            listsGroup.margins = [0, 0, 0, 0]; // Минимальные отступы
            
            // Первый список - имена слоев (динамическая ширина)
            var layersList = listsGroup.add("listbox", undefined, []);
            layersList.size = [layersListWidth, 300]; // Динамическая ширина на основе длины имен
            layersList.itemSize = [layersList.itemSize[0], 25]; // Высота строки 25 пикселей
            
            // Второй список - пути к свойствам (динамическая ширина, только для отображения, некликабельный)
            var pathsList = listsGroup.add("listbox", undefined, []);
            pathsList.size = [pathsListWidth, 300]; // Динамическая ширина на основе длины путей
            pathsList.itemSize = [pathsList.itemSize[0], 25]; // Высота строки 25 пикселей
            // Делаем список некликабельным - используем enabled = false
            // Это сделает его серым, но полностью некликабельным
            pathsList.enabled = false;
            
            // Добавляем элементы в оба списка
            for (var j = 0; j < mismatchListItems.length; j++) {
                var layerName = mismatchListItems[j][0];
                var path = mismatchListItems[j][1] || "";
                layersList.add("item", layerName);
                pathsList.add("item", path);
            }
            
            // Синхронизация выделения между двумя списками (без выделения слоя)
            // Только левый список (layersList) активен для выбора
            layersList.onChange = function() {
                // Синхронизируем выделение с правым списком (который disabled, но selection можно установить)
                try {
                    pathsList.selection = layersList.selection;
                } catch(e) {}
            };
            
            // Синхронизация скроллинга при прокрутке (только для активного списка)
            layersList.onScroll = function() {
                try {
                    pathsList.scrollPosition = layersList.scrollPosition;
                } catch(e) {}
            };
            // pathsList disabled, поэтому onScroll не нужен
        
        var buttonGroup = mismatchWindow.add("group");
        buttonGroup.orientation = "row";
        buttonGroup.alignment = "right";
        
        // Кнопка для выделения выбранного слоя (сохраняем ссылку для обновления)
        var selectLayerButton = buttonGroup.add("button", undefined, t("selectLayer"), {name: "ok"});
        
        // Сохраняем ссылки на элементы для обновления при смене языка
        if (mismatchedLayers.length > 0) {
            mismatchWindow.mismatchesListText = mismatchesListText;
            mismatchWindow.expectedPathText = expectedPathText;
            mismatchWindow.expectedPathDisplay = expectedPathDisplay; // Сохраняем значение пути
        } else {
            mismatchWindow.mismatchesListText = null;
            mismatchWindow.expectedPathText = null;
            mismatchWindow.expectedPathDisplay = null;
        }
        mismatchWindow.selectLayerButton = selectLayerButton;
        
        selectLayerButton.onClick = function() {
            try {
                var selectedIndex = -1;
                var listToCheck = layersList.selection !== null ? layersList : pathsList;
                
                if (listToCheck.selection !== null) {
                    // Пробуем получить индекс разными способами
                    if (listToCheck.selection.index !== undefined && listToCheck.selection.index !== null) {
                        selectedIndex = listToCheck.selection.index;
                    } else {
                        // Если index недоступен, ищем элемент в массиве items
                        for (var k = 0; k < listToCheck.items.length; k++) {
                            if (listToCheck.items[k] === listToCheck.selection) {
                                selectedIndex = k;
                                break;
                            }
                        }
                    }
                }
                
                if (selectedIndex >= 0 && selectedIndex < mismatchedLayers.length) {
                    var layerToSelect = mismatchedLayers[selectedIndex];
                    if (layerToSelect) {
                        // Снимаем выделение со всех слоев
                        deselectAllLayers(comp);
                        // Выделяем выбранный слой
                        layerToSelect.selected = true;
                        // Окно НЕ закрываем - пользователь может выбрать другой слой
                    } else {
                        alert(t("error") + ": " + t("layerNotFound"));
                    }
                } else {
                    alert(t("selectLayerFromList"));
                }
            } catch(e) {
                alert(t("error") + ": " + e.message);
            }
        };
        
        mismatchWindow.center();
        mismatchWindow.show();
        
        // Выделяем проблемные слои
        if (mismatchedLayers.length > 0) {
            deselectAllLayers(comp);
            selectProblemLayers(mismatchedLayers);
        }
    };

    // ===== СНИМКИ СОСТОЯНИЙ (ИСПРАВЛЕННЫЕ) =====

    saveSnapshotButton.onClick = function () {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert(t("selectComposition"), t("error"));
            return;
        }

        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            alert(t("selectAtLeastOneLayer"), t("error"));
            return;
        }

        // Проверяем режим работы
        var isFullMode = fullSnapshotCheckbox.value;
        
        if (isFullMode) {
            // Режим FULL Snapshot - используем логику saveFullSnapshotButton
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
            
            alert(t("fullSnapshotSaved") + selectedLayers.length + t("layersCount"));
            updateSnapshotButtonLabels();
            return;
        }
        
        // Режим выбранного свойства - используем оригинальную логику
        var selectedPropertyName = propertyList.selection ? propertyList.selection.text : null;
        if (!selectedPropertyName) {
            alert(t("selectPropertyFromList"), t("error"));
            return;
        }

        // ОПРЕДЕЛЯЕМ ТИП СВОЙСТВА И СОХРАНЯЕМ ПУТЬ
        var isBaseProperty = (selectedPropertyName === "Position" || selectedPropertyName === "Scale" ||
                             selectedPropertyName === "Rotation" || selectedPropertyName === "Opacity" ||
                             selectedPropertyName === "Anchor Point");
        
        var propertyPath = null; // Для кастомных свойств
        var propertyPathNames = null;
        
        if (!isBaseProperty) {
        if (!selectedProperty || !isPropertyValid(selectedProperty)) {
                alert(t("customPropertyNeeded"), t("error"));
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
                alert(t("errorSavingPath"), t("error"));
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
        
        alert(t("snapshotSaved") + selectedPropertyName + "\n" + t("layers") + ": " + savedCount + t("layersFrom") + selectedLayers.length);
        updateSnapshotButtonLabels();
    };

    restoreSnapshotButton.onClick = function () {
        // Проверяем режим работы
        var isFullMode = fullSnapshotCheckbox.value;
        
        if (isFullMode) {
            // Режим FULL Snapshot - используем логику restoreFullSnapshotButton
            if (expressionSnapshot.type !== "full") {
                alert(t("noFullSnapshot"), t("error"));
                return;
            }

            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                alert(t("selectComposition"), t("error"));
                return;
            }

            // ВОССТАНАВЛИВАЕМ из снимка!
            var layersToRestore = Object.keys(expressionSnapshot.data);
            if (layersToRestore.length === 0) {
                alert(t("noSnapshotData"), t("error"));
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
                    t("warning") + " " + t("layersFromSnapshotNotFound") +
                    missingLayers.join("\n") + "\n\n" +
                    t("continueRestore")
                );
                if (!shouldContinue) {
                    $.writeln("=== ВОССТАНОВЛЕНИЕ ОТМЕНЕНО ПОЛЬЗОВАТЕЛЕМ ===");
                    return;
                }
                $.writeln("Пользователь решил продолжить восстановление");
            }

            $.writeln("Показываем диалог подтверждения...");
            if (!confirm(t("restoreFullConfirm"))) {
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
                selectProblemLayers(problemLayers);
            }
            
            $.writeln("=== ВОССТАНОВЛЕНИЕ ЗАВЕРШЕНО: " + restored + " выражений, " + problemLayers.length + " слоев с проблемами ===");
            
            var message = t("restored") + restored + t("expressions");
            if (problemLayers.length > 0) {
                message += "\n\n" + problemLayers.length + " " + t("layersWithProblems");
            }
            alert(message);
            updateSnapshotButtonLabels();
            return;
        }
        
        // Режим выбранного свойства - используем оригинальную логику
        $.writeln("=== RESTORE SNAPSHOT BUTTON CLICKED ===");
        $.writeln("expressionSnapshot.type: " + (expressionSnapshot.type || "undefined"));
        $.writeln("expressionSnapshot.data: " + (expressionSnapshot.data ? Object.keys(expressionSnapshot.data).length + " слоев" : "undefined"));
        
        if (expressionSnapshot.type !== "selectedProperty") {
            $.writeln("ОШИБКА: Нет сохраненного снимка для свойства. type=" + expressionSnapshot.type);
            alert(t("noPropertySnapshot"), t("error"));
            return;
        }

        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            $.writeln("ОШИБКА: Не выбрана композиция");
            alert(t("selectComposition"), t("error"));
            return;
        }

        // ВОССТАНАВЛИВАЕМ из снимка, а не из текущего выбора!
        var layersToRestore = Object.keys(expressionSnapshot.data);
        $.writeln("layersToRestore: " + layersToRestore.length + " слоев");
        if (layersToRestore.length === 0) {
            $.writeln("ОШИБКА: В снимке нет данных для восстановления");
            alert(t("noSnapshotData"), t("error"));
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
                missingProperties.push(layerName + t("layerNotFound"));
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
                missingProperties.push(layerName + t("propertyNotFound"));
                $.writeln("    ✗ Свойство не найдено или не поддерживает выражения");
                } else {
                $.writeln("    ✓ Свойство найдено и поддерживает выражения");
            }
        }
        
        $.writeln("Проверка завершена. Проблемных слоев: " + missingProperties.length);
        
        if (missingProperties.length > 0) {
            $.writeln("Показываем диалог с предупреждением...");
            var shouldContinue = confirm(
                t("warning") + " " + t("layersFromSnapshotProblems") +
                missingProperties.join("\n") + "\n\n" +
                t("possibleReasonsRestore") +
                t("effectDeletedRestore") +
                t("layerRenamedRestore") +
                t("effectsOrderChangedRestore") +
                t("continueRestoreOthers")
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
            selectProblemLayers(problemLayers);
        }
        
        $.writeln("=== ВОССТАНОВЛЕНИЕ ЗАВЕРШЕНО: " + restored + " успешно, " + failed + " с ошибками ===");
        
        var message = t("restored") + restored + t("expressions");
        if (problemLayers.length > 0) {
            message += "\n\n" + problemLayers.length + " " + t("layersWithErrors");
        }
        alert(message);
        
        updateSnapshotButtonLabels();
    };

    // Старые обработчики удалены - логика объединена в saveSnapshotButton и restoreSnapshotButton

    // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
    
    // Функция для снятия выделения со всех слоев композиции
    function deselectAllLayers(comp) {
        try {
            for (var i = 1; i <= comp.numLayers; i++) {
                comp.layer(i).selected = false;
            }
        } catch (e) {
            // Игнорируем ошибки при снятии выделения
        }
    }
    
    // Функция для выделения проблемных слоев
    function selectProblemLayers(layers) {
        for (var i = 0; i < layers.length; i++) {
            try {
                layers[i].selected = true;
            } catch (e) {
                // Игнорируем ошибки при выделении
            }
        }
    }
    
    // Функция для безопасной проверки isValid свойства
    function isPropertyValid(property) {
        if (!property) return false;
        try {
            return property.isValid !== false;
        } catch (e) {
            return property !== null;
        }
    }
    
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
        
        if (!isPropertyValid(selectedProperty)) {
            $.writeln(t("propertyNoLongerExists"));
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
                    var hasExpression = expr && expr !== "";
                    var showOnlyWithExpressions = showOnlyWithExpressionsCheckbox.value;
                    
                    // Если чекбокс включен - показываем только с выражениями, если выключен - показываем все
                    if (hasExpression || !showOnlyWithExpressions) {
                        // Включаем выражение, если оно еще не включено
                        try {
                            if (!prop.expressionEnabled && hasExpression) {
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
                        $.writeln("  Найдено свойство" + (hasExpression ? " с выражением" : "") + ": " + layer.name + " > " + propertyName);
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
        if (comp instanceof CompItem) {
            deselectAllLayers(comp);
            $.writeln("Шаг 0: Снято выделение со всех слоев композиции");
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
                
                var exprPreview = originalExpr ? (originalExpr.length > 30 ? originalExpr.substring(0, 30) + "..." : originalExpr) : "(нет выражения)";
                $.writeln("  [" + (i + 1) + "] " + targetProps[i].path + ": '" + exprPreview + "' -> '1/0'");
                
                // Создаем ошибку выражения (даже если выражения не было - это нужно для раскрытия свойства)
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
        
        // Шаг 9: Выделение остается (убрано снятие выделения)
        $.writeln("Шаг 9: Выделение слоев сохранено");
        
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

    function showPropertySelectedDialog(propertyName) {
        var dialog = new Window("dialog", t("selected"));
        dialog.orientation = "column";
        dialog.alignChildren = "left";
        
        var infoGroup = dialog.add("group");
        infoGroup.orientation = "column";
        infoGroup.alignChildren = "left";
        
        var messageText = infoGroup.add("statictext", undefined, t("selected") + propertyName);
        try {
            messageText.graphics.font = ScriptUI.newFont(messageText.graphics.font.name, ScriptUI.FontStyle.BOLD);
        } catch(e){}
        
        var buttonGroup = dialog.add("group");
        buttonGroup.orientation = "row";
        buttonGroup.alignment = "right";
        
        var okButton = buttonGroup.add("button", undefined, "OK", {name: "ok"});
        okButton.onClick = function() { dialog.close(1); };
        
        dialog.center();
        dialog.show();
    }

    function showMismatchDialog(layerName, mismatchInfo, originalPath, foundPath, hasMoreLayers) {
        var dialog = new Window("dialog", t("mismatchDetected") + " " + t("layer"));
        dialog.orientation = "column";
        dialog.alignChildren = "left";
        // УБРАЛИ предпочтительный размер - окно будет автоматическим
        
        var infoGroup = dialog.add("group");
        infoGroup.orientation = "column";
        infoGroup.alignChildren = "left";
        
        var layerText = infoGroup.add("statictext", undefined, t("layer") + layerName);
        try {
            layerText.graphics.font = ScriptUI.newFont(layerText.graphics.font.name, ScriptUI.FontStyle.BOLD);
        } catch(e){}
        
        infoGroup.add("statictext", undefined, "");
        infoGroup.add("statictext", undefined, t("mismatchDetected") + mismatchInfo);
        infoGroup.add("statictext", undefined, "");
        infoGroup.add("statictext", undefined, t("expectedPath") + ":");
        var originalText = infoGroup.add("statictext", undefined, "  " + originalPath.join(" → "));
        try {
            originalText.graphics.font = ScriptUI.newFont(originalText.graphics.font.name, ScriptUI.FontStyle.ITALIC);
        } catch(e){}
        
        infoGroup.add("statictext", undefined, t("foundPath") + ":");
        var foundText = infoGroup.add("statictext", undefined, "  " + foundPath.join(" → "));
        try {
            foundText.graphics.font = ScriptUI.newFont(foundText.graphics.font.name, ScriptUI.FontStyle.ITALIC);
        } catch(e){}
        
        infoGroup.add("statictext", undefined, "");
        infoGroup.add("statictext", undefined, t("finalPropertyMatches"));
        
        var applyToAllCheck = null;
        if (hasMoreLayers) {
            applyToAllCheck = infoGroup.add("checkbox", undefined, t("applyToAll"));
        }
        
        var buttonGroup = dialog.add("group");
        buttonGroup.orientation = "row";
        buttonGroup.alignment = "right";
        
        var applyButton = buttonGroup.add("button", undefined, t("apply"), {name: "ok"});
        var skipButton = buttonGroup.add("button", undefined, t("skip"));
        var abortButton = buttonGroup.add("button", undefined, t("abortOperation"));
        
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
