// script.js

// Конфигурация проектов для парсинга версий
const PROJECTS_CONFIG = {
    'bwt': {
        selector: '.card-bwt .version-tag',
        repo: 'VladislavBanitsky/BestWinTweaker',
        defaultVersion: '1.9.14',
        label: 'Версия'
    },
    'winpe': {
        selector: '.card-winpe .version-tag',
        repo: 'VladislavBanitsky/VladWinPE',
        defaultVersion: '1.3',
        label: 'Версия'
    },
    // Добавьте новые проекты сюда по аналогии
    // 'myproject': {
    //     selector: '.card-myproject .version-tag',
    //     repo: 'username/repository',
    //     defaultVersion: '1.0.0',
    //     label: 'Версия'
    // }
};


// Конфигурация цветов для карточек
const CARD_COLORS = {
    'card-win7': { r: 28, g: 40, b: 68, accent: [0, 180, 255] },
    'card-win10': { r: 20, g: 44, b: 78, accent: [0, 120, 215] },
    'card-win11': { r: 30, g: 30, b: 70, accent: [0, 80, 200] },
    'card-bwt': { r: 50, g: 30, b: 70, accent: [180, 80, 255] },
    'card-autounattend': { r: 70, g: 40, b: 10, accent: [255, 140, 0] },
    'card-winpe': { r: 20, g: 60, b: 50, accent: [0, 200, 150] },
    'card-11arm': { r: 40, g: 20, b: 60, accent: [150, 80, 255] },
    'card-11new': { r: 25, g: 50, b: 75, accent: [50, 150, 255] }
};

// Класс для генерации градиентов
class GradientGenerator {
    constructor() {
        this.gradients = new Map();
    }

    // Генерация случайного цвета с плавным переходом
    generateRandomColor(baseR, baseG, baseB, variation = 30) {
        const r = Math.max(0, Math.min(255, baseR + (Math.random() - 0.5) * variation * 2));
        const g = Math.max(0, Math.min(255, baseG + (Math.random() - 0.5) * variation * 2));
        const b = Math.max(0, Math.min(255, baseB + (Math.random() - 0.5) * variation * 2));
        return { r, g, b };
    }

    // Создание градиента для карточки
    generateCardGradient(baseColor, accentColor, opacity = 0.85) {
        const { r, g, b } = baseColor;
        const [ar, ag, ab] = accentColor;

        // Вариации базового цвета для градиента
        const color1 = this.generateRandomColor(r, g, b, 15);
        const color2 = this.generateRandomColor(r, g, b, 25);
        const color3 = this.generateRandomColor(r, g, b, 35);

        // Создаем несколько вариантов градиента
        const gradients = [
            `radial-gradient(circle at 20% 20%, rgba(${color1.r},${color1.g},${color1.b},${opacity}) 0%, rgba(${color2.r},${color2.g},${color2.b},${opacity}) 50%, rgba(${color3.r},${color3.g},${color3.b},${opacity}) 100%)`,
            `linear-gradient(135deg, rgba(${r},${g},${b},${opacity}) 0%, rgba(${r+20},${g+10},${b+30},${opacity}) 50%, rgba(${r-10},${g+20},${b-20},${opacity}) 100%)`,
            `linear-gradient(45deg, rgba(${r-20},${g+10},${b+20},${opacity}) 0%, rgba(${r+15},${g-10},${b+40},${opacity}) 50%, rgba(${r+10},${g+20},${b-10},${opacity}) 100%)`,
            `radial-gradient(ellipse at 70% 30%, rgba(${color1.r},${color1.g},${color1.b},${opacity}) 0%, rgba(${color2.r},${color2.g},${color2.b},${opacity}) 60%, rgba(${color3.r},${color3.g},${color3.b},${opacity}) 100%)`
        ];

        // Выбираем случайный градиент
        return gradients[Math.floor(Math.random() * gradients.length)];
    }

    // Генерация цвета для версии-тега
    generateTagColor(accentColor) {
        const [r, g, b] = accentColor;
        return `rgba(${r},${g},${b},0.15)`;
    }

    // Генерация цвета для границы версии-тега
    generateTagBorder(accentColor) {
        const [r, g, b] = accentColor;
        return `rgba(${r},${g},${b},0.2)`;
    }

    // Генерация цвета для текста версии-тега
    generateTagText(accentColor) {
        const [r, g, b] = accentColor;
        // Светлый вариант акцентного цвета
        const lightR = Math.min(255, r + 100);
        const lightG = Math.min(255, g + 100);
        const lightB = Math.min(255, b + 100);
        return `rgb(${lightR},${lightG},${lightB})`;
    }

    // Генерация цвета для кнопки при наведении
    generateButtonHover(accentColor) {
        const [r, g, b] = accentColor;
        return `rgba(${r},${g},${b},0.3)`;
    }

    // Генерация тени для кнопки при наведении
    generateButtonShadow(accentColor) {
        const [r, g, b] = accentColor;
        return `0 8px 20px rgba(${r},${g},${b},0.3)`;
    }

    // Применение градиента к карточке
    applyGradientToCard(card, cardClass) {
        const colorConfig = CARD_COLORS[cardClass];
        if (!colorConfig) return;

        const baseColor = { r: colorConfig.r, g: colorConfig.g, b: colorConfig.b };
        const accentColor = colorConfig.accent;

        // Генерируем и применяем градиент
        const gradient = this.generateCardGradient(baseColor, accentColor);
        card.style.background = gradient;

        // Настраиваем тег версии
        const versionTag = card.querySelector('.version-tag');
        if (versionTag) {
            versionTag.style.background = this.generateTagColor(accentColor);
            versionTag.style.borderColor = this.generateTagBorder(accentColor);
            versionTag.style.color = this.generateTagText(accentColor);
        }

        // Настраиваем кнопку скачивания
        const downloadBtn = card.querySelector('.download-btn');
        if (downloadBtn) {
            // Добавляем динамические стили для кнопки
            downloadBtn.addEventListener('mouseenter', () => {
                downloadBtn.style.borderColor = `rgb(${accentColor[0]},${accentColor[1]},${accentColor[2]})`;
                downloadBtn.style.boxShadow = this.generateButtonShadow(accentColor);
            });
            downloadBtn.addEventListener('mouseleave', () => {
                downloadBtn.style.borderColor = 'rgba(255,255,255,0.12)';
                downloadBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            });
        }
    }
}

// Класс для управления версиями
class VersionManager {
    constructor() {
        this.cacheKey = 'github_versions';
        this.cacheTime = 3600000; // 1 час
    }

    async getVersion(repo) {
        const cached = this.getCachedVersion(repo);
        if (cached) return cached;

        try {
            const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'itFlashka-App'
                }
            });

            if (!response.ok) {
                // Если репозиторий не найден или нет релизов
                if (response.status === 404) {
                    console.warn(`Репозиторий ${repo} не найден или нет релизов`);
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const version = data.tag_name;

            this.setCachedVersion(repo, version);
            return version;
        } catch (error) {
            console.error(`Ошибка получения версии для ${repo}:`, error);
            return null;
        }
    }

    getCachedVersion(repo) {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (cached) {
                const data = JSON.parse(cached);
                if (data[repo] && data[repo].timestamp) {
                    if (Date.now() - data[repo].timestamp < this.cacheTime) {
                        return data[repo].version;
                    }
                }
            }
        } catch (e) {
            console.warn('Ошибка чтения кэша:', e);
        }
        return null;
    }

    setCachedVersion(repo, version) {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            const data = cached ? JSON.parse(cached) : {};

            data[repo] = {
                version: version,
                timestamp: Date.now()
            };

            localStorage.setItem(this.cacheKey, JSON.stringify(data));
        } catch (e) {
            console.warn('Ошибка записи кэша:', e);
        }
    }

    // Очистка кэша для конкретного репозитория
    clearCache(repo) {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (cached) {
                const data = JSON.parse(cached);
                delete data[repo];
                localStorage.setItem(this.cacheKey, JSON.stringify(data));
            }
        } catch (e) {
            console.warn('Ошибка очистки кэша:', e);
        }
    }

    // Очистка всего кэша
    clearAllCache() {
        try {
            localStorage.removeItem(this.cacheKey);
        } catch (e) {
            console.warn('Ошибка очистки кэша:', e);
        }
    }
}

// Функция обновления версии на странице
async function updateVersionDisplay(projectKey) {
    const config = PROJECTS_CONFIG[projectKey];
    if (!config) {
        console.warn(`Проект "${projectKey}" не найден в конфигурации`);
        return;
    }

    const versionTag = document.querySelector(config.selector);
    if (!versionTag) {
        console.warn(`Элемент для "${projectKey}" не найден на странице`);
        return;
    }

    // Показываем, что идет загрузка
    versionTag.textContent = '⏳ Загрузка...';

    const versionManager = new VersionManager();
    const version = await versionManager.getVersion(config.repo);

    if (version) {
        // Убираем 'v' из начала, если есть
        const cleanVersion = version.replace(/^v\.?/, '');
        versionTag.textContent = `${config.label} ${cleanVersion}`;
    } else {
        // Если не удалось получить версию, показываем стандартную
        versionTag.textContent = `${config.label} ${config.defaultVersion}`;
    }
}

// Обновление всех версий
async function updateAllVersions() {
    const projectKeys = Object.keys(PROJECTS_CONFIG);

    // Запускаем все запросы параллельно для скорости
    const promises = projectKeys.map(key => updateVersionDisplay(key));
    await Promise.allSettled(promises);
}

// Обработчик кликов по кнопкам скачивания
function setupDownloadButtons() {
    const buttons = document.querySelectorAll('.download-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const originalText = this.textContent;
            this.textContent = '⏳ Загрузка...';
            this.style.opacity = '0.7';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.opacity = '1';
            }, 1500);
        });
    });
}

// Функция для ручного обновления версий (можно вызвать из консоли)
window.forceUpdateVersions = function() {
    const versionManager = new VersionManager();
    versionManager.clearAllCache();
    updateAllVersions();
    console.log('✅ Версии обновлены!');
};

// Функция для генерации градиентов для всех карточек
function generateGradientsForCards() {
    const gradientGenerator = new GradientGenerator();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Получаем класс карточки
        const cardClasses = Array.from(card.classList);
        const cardClass = cardClasses.find(cls => cls.startsWith('card-'));

        if (cardClass && CARD_COLORS[cardClass]) {
            gradientGenerator.applyGradientToCard(card, cardClass);
        }
    });
}

// Функция для добавления новой карточки с автоматической генерацией градиента
window.addCard = function(cardClass, baseColor, accentColor, opacity = 0.85) {
    // Добавляем в конфигурацию цветов
    CARD_COLORS[cardClass] = {
        r: baseColor.r,
        g: baseColor.g,
        b: baseColor.b,
        accent: accentColor
    };

    // Находим все карточки с этим классом и применяем градиент
    const cards = document.querySelectorAll(`.${cardClass}`);
    const gradientGenerator = new GradientGenerator();

    cards.forEach(card => {
        gradientGenerator.applyGradientToCard(card, cardClass);
    });

    console.log(`✅ Градиент для ${cardClass} сгенерирован и применен`);
};

// Функция для регенерации градиентов
window.regenerateGradients = function() {
    generateGradientsForCards();
    console.log('🔄 Градиенты перегенерированы!');
};

// Функция для ручного обновления версий
window.forceUpdateVersions = function() {
    const versionManager = new VersionManager();
    versionManager.clearAllCache();
    updateAllVersions();
    console.log('✅ Версии обновлены!');
};

// Функция для добавления нового проекта в конфигурацию (динамически)
window.addProject = function(key, repo, selector, defaultVersion = '1.0.0', label = 'Версия') {
    PROJECTS_CONFIG[key] = {
        selector: selector,
        repo: repo,
        defaultVersion: defaultVersion,
        label: label
    };
    console.log(`✅ Проект "${key}" добавлен в конфигурацию`);
    // Обновляем версию для нового проекта
    updateVersionDisplay(key);
};

// Функция для отображения статуса всех проектов
window.showVersionStatus = function() {
    const status = {};
    Object.keys(PROJECTS_CONFIG).forEach(key => {
        const config = PROJECTS_CONFIG[key];
        const element = document.querySelector(config.selector);
        status[key] = {
            repo: config.repo,
            currentVersion: element ? element.textContent : 'Элемент не найден',
            defaultVersion: config.defaultVersion
        };
    });
    console.table(status);
    return status;
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Генерируем градиенты для карточек
    generateGradientsForCards();

    // Обновляем все версии
    updateAllVersions();

    // Настраиваем кнопки
    setupDownloadButtons();

    console.log('🚀 Проект инициализирован!');
    console.log('🎨 Градиенты сгенерированы автоматически');
    console.log('📦 Доступные проекты:', Object.keys(PROJECTS_CONFIG));
    console.log('💡 Используйте forceUpdateVersions() для обновления кэша');
    console.log('💡 Используйте showVersionStatus() для просмотра статуса');
    console.log('💡 Используйте addProject() для добавления нового проекта');
    console.log('💡 Используйте addCard() для добавления новой карточки с градиентом');
    console.log('💡 Используйте regenerateGradients() для перегенерации градиентов');
});