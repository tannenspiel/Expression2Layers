# Expression2Layers for After Effects (EN)

**Expression2Layers v1.2** — A utility for Adobe After Effects that allows you to quickly copy and batch apply expressions to similar properties of other layers. Speeds up batch work with transform properties and custom effect parameters.

**Performance optimizations:** v1.2 includes performance improvements for faster processing of large numbers of layers and properties.

## Features

- **Get expression from selected property** — Extract expression from any layer property  
- **Batch apply expressions** — Apply expression to multiple selected layers at once  
- **Support for standard and custom properties** — Works with transform properties (`Position`, `Scale`, `Rotation`, `Opacity`, `Anchor Point`) and custom effect properties  
- **Expression snapshots** — Save and restore expression states:
  - **Full Snapshot** — Save all expressions from all properties of selected layers
  - **Property Snapshot** — Save expression for a specific property
- **Smart property matching** — Handles property path mismatches (e.g., when effect order changes)
- **Clear all expressions** — Remove all expressions from selected layers recursively
- **Bilingual interface** — English and Russian language support
- **Expression editor** — Built-in multiline text editor for viewing and editing expressions
- **Property mismatch detection** — Check for property path mismatches across layers (e.g., when effect order changes)
- **Show selected property expressions** — Reveal properties with expressions on selected layers
- **Performance optimizations** — Optimized algorithms for faster processing of large layer sets

## How to Use

### Basic Workflow

1. Open a composition and select a layer with the desired property.
2. Select the property in the **Timeline** panel (e.g., `Transform > Opacity` or `Effect > Slider Control`) and click **Get Custom Property**.  
   The script will detect the property name and add it to the list.
3. The **Expression Text** field will show the current expression (if any) for editing.
4. Enter or edit the expression text in the **Expression Text** field.
5. Select one or more layers where you want to apply the expression.
6. In the property list, select the target property (e.g., `Position` or `Custom: My Slider`).
7. Click **WRITE EXPRESSION to Selected Layers**.  
   The script will apply the expression to all selected layers where the matching property is found.

### Expression Snapshots

#### Saving a Snapshot

**For a specific property:**
1. Select the property from the list (or use "Get Custom Property" first).
2. Select the layers you want to snapshot.
3. Make sure "FULL Snapshot" checkbox is **unchecked**.
4. Click **Save Snapshot: [property name]**.

**For all properties (Full Snapshot):**
1. Select the layers you want to snapshot.
2. Check the **"FULL Snapshot (All Properties)"** checkbox.
3. Click **Save FULL Snapshot (All Properties)**.

#### Restoring a Snapshot

1. Select the layers you want to restore (or the script will use layers from the snapshot).
2. Choose the snapshot mode:
   - **Property Snapshot**: Uncheck "FULL Snapshot" and click **Restore Snapshot: [property name]**
   - **Full Snapshot**: Check "FULL Snapshot" and click **Restore FULL Snapshot**
3. Confirm the restoration (this will overwrite current expressions).

### Clearing Expressions

1. Select the layers you want to clear.
2. Click **CLEAR ALL EXPRESSIONS from Selected Layers**.
3. Confirm the action.
4. All expressions will be recursively removed from all properties of selected layers.

## Interface

### Left Panel
- **Expression Text** — Multiline text field (750x300) for entering/editing expressions
- **Get Custom Property** button — Captures the selected property from the active layer
- **Property List** — Contains standard transform properties and the last selected custom property:
  - Position
  - Scale
  - Rotation
  - Opacity
  - Anchor Point
  - Custom: [property name] (after using "Get Custom Property")
- **WRITE EXPRESSION to Selected Layers** button — Applies the current expression to selected layers
- **CLEAR ALL EXPRESSIONS from Selected Layers** button — Removes all expressions from selected layers

### Right Panel
- **Expression Snapshots** section:
  - **FULL Snapshot (All Properties)** checkbox — Toggles between full snapshot and property snapshot mode
  - **Save Snapshot** button — Saves expression snapshot (text changes based on mode)
  - **Restore Snapshot** button — Restores expression snapshot (text changes based on mode)
- **Show Selected Property Expression** section:
  - **Show Selected Property Expression** button — Reveals the selected property with expressions on selected layers
  - **Show only properties with expressions** checkbox — When enabled, shows only properties with expressions; when disabled, shows all selected properties
- **Check Property Mismatches** section:
  - **Check Property Mismatches** / **Check Property Matches** button — Checks for property path mismatches or matches across layers
  - **Show mismatches** checkbox — When enabled, shows mismatches; when disabled, shows matches

### Top Bar
- **Language / Язык** dropdown — Switch between English and Russian interface

## Installation

1. Save the script file as `Expression2Layers_v1.2.jsx` (or any name with `.jsx` extension).
2. Place it in the folder:
   ```
   %USERPROFILE%\Documents\Adobe\After Effects <version>\Scripts\ScriptUI Panels\
   ```
   Or on Mac:
   ```
   ~/Documents/Adobe/After Effects <version>/Scripts/ScriptUI Panels/
   ```
3. Restart After Effects.
4. Open via menu: **Window → Expression2Layers** (or the filename you used).

## Requirements

- Adobe After Effects CC 2020 or newer
- **Allow Scripts to Write Files and Access Network** must be enabled in preferences:
  - **Edit → Preferences → Scripting & Expressions** (Windows)
  - **After Effects → Preferences → Scripting & Expressions** (Mac)

## Advanced Features

### Property Path Mismatch Handling

If the script detects that a property path has changed (e.g., effect order changed, layer renamed), it will show a dialog asking:
- **Apply** — Apply the expression anyway (if the final property matches)
- **Skip** — Skip this layer
- **Abort Operation** — Cancel the entire operation
- **Apply to all remaining layers** — Apply the same decision to all remaining layers

### Check Property Mismatches

The **Check Property Mismatches** feature allows you to:
- **Detect mismatches**: Find layers where the property path differs from the initially selected property
- **Detect matches**: Find layers where the property path matches (when checkbox is disabled)
- **Work with all layers**: If no layers are selected, the check is performed on all layers in the composition
- **View results**: A non-modal window displays a two-column list (Layer Name | Property Path) with the expected path
- **Select layers**: Click "Select Layer" to select problematic layers in the composition without closing the window

The mismatch window dynamically adjusts its width based on the longest layer name and property path.

### Expression Snapshot Structure

Snapshots are stored in memory during the session. They include:
- Property paths (for custom properties)
- Expression text
- Layer names
- Property types (base vs custom)

**Note:** Snapshots are lost when the script window is closed.

## Author

**Developer:** Eduard (Tannenspiel)  
**Email:** tannenspiel@gmail.com  
**Version:** v1.2

---

> This script is designed to speed up routine work with expressions in projects where batch copying or applying expressions to multiple layers is required.

---

---

# Expression2Layers для After Effects (RU)

**Expression2Layers v1.2** — утилита для Adobe After Effects, позволяющая быстро копировать и массово применять выражения (expressions) к аналогичным свойствам других слоёв. Ускоряет пакетную работу со свойствами трансформации и пользовательскими параметрами эффектов.

**Оптимизации производительности:** v1.2 включает улучшения производительности для более быстрой обработки больших количеств слоёв и свойств.

## Возможности

- **Получить выражение из выбранного свойства** — извлечение выражения из любого свойства слоя  
- **Массовое применение выражений** — применение выражения к множеству выбранных слоёв одновременно  
- **Поддержка стандартных и кастомных свойств** — работает со свойствами трансформации (`Position`, `Scale`, `Rotation`, `Opacity`, `Anchor Point`) и пользовательскими свойствами эффектов  
- **Снимки выражений** — сохранение и восстановление состояний выражений:
  - **Полный снимок** — сохранение всех выражений из всех свойств выбранных слоёв
  - **Снимок свойства** — сохранение выражения для конкретного свойства
- **Умное сопоставление свойств** — обработка несовпадений путей к свойствам (например, при изменении порядка эффектов)
- **Очистка всех выражений** — удаление всех выражений из выбранных слоёв рекурсивно
- **Двуязычный интерфейс** — поддержка английского и русского языков
- **Редактор выражений** — встроенный многострочный текстовый редактор для просмотра и редактирования выражений
- **Проверка несовпадений свойств** — проверка несовпадений путей к свойствам между слоями (например, при изменении порядка эффектов)
- **Показ выражений выбранного свойства** — раскрытие свойств с выражениями на выбранных слоях
- **Оптимизации производительности** — оптимизированные алгоритмы для более быстрой обработки больших наборов слоёв

## Как использовать

### Основной рабочий процесс

1. Откройте композицию и выберите слой с нужным свойством.
2. Выделите свойство в панели **Timeline** (например, `Transform > Opacity` или `Effect > Slider Control`) и нажмите кнопку **Получить кастомное свойство**.  
   Скрипт определит имя свойства и добавит его в список.
3. В поле **Текст выражения** отобразится текущее выражение (если есть) для редактирования.
4. Введите или отредактируйте текст выражения в поле **Текст выражения**.
5. Выберите один или несколько слоёв, на которые нужно применить выражение.
6. В списке свойств выберите целевое свойство (например, `Position` или `Custom: My Slider`).
7. Нажмите кнопку **ЗАПИСАТЬ ВЫРАЖЕНИЕ в выбранные слои**.  
   Скрипт применит выражение ко всем выбранным слоям, где найдено соответствующее свойство.

### Снимки выражений

#### Сохранение снимка

**Для конкретного свойства:**
1. Выберите свойство из списка (или сначала используйте "Получить кастомное свойство").
2. Выберите слои, для которых нужно создать снимок.
3. Убедитесь, что чекбокс "ПОЛНЫЙ снимок" **не отмечен**.
4. Нажмите **Сохранить снимок: [имя свойства]**.

**Для всех свойств (Полный снимок):**
1. Выберите слои, для которых нужно создать снимок.
2. Отметьте чекбокс **"ПОЛНЫЙ снимок (Все свойства)"**.
3. Нажмите **Сохранить ПОЛНЫЙ снимок (Все свойства)**.

#### Восстановление снимка

1. Выберите слои, для которых нужно восстановить выражения (или скрипт использует слои из снимка).
2. Выберите режим снимка:
   - **Снимок свойства**: Снимите отметку с "ПОЛНЫЙ снимок" и нажмите **Восстановить снимок: [имя свойства]**
   - **Полный снимок**: Отметьте "ПОЛНЫЙ снимок" и нажмите **Восстановить ПОЛНЫЙ снимок**
3. Подтвердите восстановление (это перезапишет текущие выражения).

### Очистка выражений

1. Выберите слои, для которых нужно очистить выражения.
2. Нажмите **ОЧИСТИТЬ ВСЕ ВЫРАЖЕНИЯ в выбранных слоях**.
3. Подтвердите действие.
4. Все выражения будут рекурсивно удалены из всех свойств выбранных слоёв.

## Интерфейс

### Левая панель
- **Текст выражения** — многострочное текстовое поле (750x300) для ввода/редактирования выражений
- Кнопка **Получить кастомное свойство** — запоминает выделенное свойство активного слоя
- **Список свойств** — содержит стандартные свойства трансформации и последнее выбранное кастомное свойство:
  - Position
  - Scale
  - Rotation
  - Opacity
  - Anchor Point
  - Custom: [имя свойства] (после использования "Получить кастомное свойство")
- Кнопка **ЗАПИСАТЬ ВЫРАЖЕНИЕ в выбранные слои** — применяет текущее выражение к выбранным слоям
- Кнопка **ОЧИСТИТЬ ВСЕ ВЫРАЖЕНИЯ в выбранных слоях** — удаляет все выражения из выбранных слоёв

### Правая панель
- Секция **Снимки выражений**:
  - Чекбокс **ПОЛНЫЙ снимок (Все свойства)** — переключает между режимом полного снимка и снимка свойства
  - Кнопка **Сохранить снимок** — сохраняет снимок выражения (текст меняется в зависимости от режима)
  - Кнопка **Восстановить снимок** — восстанавливает снимок выражения (текст меняется в зависимости от режима)
- Секция **Показать выражение выбранного свойства**:
  - Кнопка **Показать выражение выбранного свойства** — раскрывает выбранное свойство с выражениями на выбранных слоях
  - Чекбокс **Показывать только свойства с выражениями** — при включении показывает только свойства с выражениями; при выключении показывает все выбранные свойства
- Секция **Проверить несовпадения свойств**:
  - Кнопка **Проверить несовпадения свойств** / **Проверить совпадения свойств** — проверяет несовпадения или совпадения путей к свойствам между слоями
  - Чекбокс **Показывать несовпадения** — при включении показывает несовпадения; при выключении показывает совпадения

### Верхняя панель
- Выпадающий список **Language / Язык** — переключение между английским и русским интерфейсом

## Установка

1. Сохраните файл скрипта как `Expression2Layers_v1.2.jsx` (или любое имя с расширением `.jsx`).
2. Поместите его в папку:
   ```
   %USERPROFILE%\Documents\Adobe\After Effects <версия>\Scripts\ScriptUI Panels\
   ```
   Или на Mac:
   ```
   ~/Documents/Adobe/After Effects <версия>/Scripts/ScriptUI Panels/
   ```
3. Перезапустите After Effects.
4. Откройте через меню: **Window → Expression2Layers** (или имя файла, которое вы использовали).

## Требования

- Adobe After Effects CC 2020 или новее
- **Allow Scripts to Write Files and Access Network** должен быть включён в настройках:
  - **Edit → Preferences → Scripting & Expressions** (Windows)
  - **After Effects → Preferences → Scripting & Expressions** (Mac)

## Дополнительные возможности

### Обработка несовпадений путей к свойствам

Если скрипт обнаруживает, что путь к свойству изменился (например, изменился порядок эффектов, слой переименован), он покажет диалог с вопросами:
- **Применить** — применить выражение в любом случае (если конечное свойство совпадает)
- **Пропустить** — пропустить этот слой
- **Отменить операцию** — отменить всю операцию
- **Применить это решение ко всем остальным слоям** — применить то же решение ко всем остальным слоям

### Проверка несовпадений свойств

Функция **Проверить несовпадения свойств** позволяет:
- **Обнаруживать несовпадения**: Находить слои, где путь к свойству отличается от изначально выбранного свойства
- **Обнаруживать совпадения**: Находить слои, где путь к свойству совпадает (когда чекбокс выключен)
- **Работать со всеми слоями**: Если слои не выделены, проверка выполняется по всем слоям композиции
- **Просматривать результаты**: Немодальное окно отображает двухколоночный список (Имя слоя | Путь к свойству) с ожидаемым путём
- **Выделять слои**: Нажмите "Выделить слой" для выделения проблемных слоёв в композиции без закрытия окна

Окно с несовпадениями динамически подстраивает свою ширину в зависимости от самого длинного имени слоя и пути к свойству.

### Структура снимка выражений

Снимки хранятся в памяти во время сессии. Они включают:
- Пути к свойствам (для кастомных свойств)
- Текст выражений
- Имена слоёв
- Типы свойств (базовые или кастомные)

**Примечание:** Снимки теряются при закрытии окна скрипта.

## Автор

**Разработчик:** Эдуард (Tannenspiel)  
**Email:** tannenspiel@gmail.com  
**Версия:** v1.2

---

> Скрипт предназначен для ускорения рутинной работы с expressions в проектах, где требуется пакетное копирование или применение выражений к множеству слоёв.
