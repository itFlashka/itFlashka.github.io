// script.js

// Конфигурация проектов для парсинга версий
const PROJECTS_CONFIG = {
    'bwt': {
        selector: '.card-bwt .version-tag',
        repo: 'VladislavBanitsky/BestWinTweaker',
        defaultVersion: '1.0',
        label: 'Версия'
    },
    'winpe': {
        selector: '.card-winpe .version-tag',
        repo: 'VladislavBanitsky/VladWinPE',
        defaultVersion: '1.0',
        label: 'Версия'
    }
};

// Класс для управления версиями
class VersionManager {
    constructor() {
        this.cacheKey = 'github_versions';
        this.cacheTime = 3600000; // 1 час
    }

    async getVersion() {
        const cached = this.getCachedVersion();
        if (cached) return cached;

        try {
            const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'itFlashka-App'
                }
            });
            
            if (!response.ok) {
                if (response.status === 404)
                    console.warn(`Репозиторий ${repo} не найден или нет релизов`);
                    return null;
            }

            throw new Error(`Ошибка соединения! Статус: ${response.status}`);
            
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
                if (Date.now() - data[repo].timestamp < this.cacheTime) {
                    return data[repo].version;
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
        const cleanVersion = version.replace(/^v/, '');
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обновляем все версии
    updateAllVersions();
    
    // Настраиваем кнопки
    setupDownloadButtons();

    console.log('🚀 Проект инициализирован!');
});