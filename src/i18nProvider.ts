import * as vscode from 'vscode';
import * as path from 'path';

/**
 * 国际化提供器
 * 负责根据用户的语言环境提供本地化的文本内容
 */
export class I18nProvider {
    private messages: { [key: string]: string } = {};
    private currentLocale: string;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.currentLocale = this.detectLocale();
        this.loadMessages();
    }

    /**
     * 检测当前的语言环境
     * @returns 语言代码
     */
    private detectLocale(): string {
        // 获取VSCode的语言设置
        const locale = vscode.env.language;
        
        // 支持的语言映射
        const supportedLocales: { [key: string]: string } = {
            'zh-cn': 'zh-cn',
            'zh-tw': 'zh-cn', // 繁体中文暂时使用简体中文
            'zh': 'zh-cn',
            'en': 'en',
            'en-us': 'en',
            'en-gb': 'en'
        };

        return supportedLocales[locale.toLowerCase()] || 'en';
    }

    /**
     * 加载语言文件中的消息
     */
    private loadMessages(): void {
        try {
            // 构建语言文件路径
            const localeFileName = this.currentLocale === 'zh-cn' ? 'package.nls.zh-cn.json' : 'package.nls.json';
            const localeFilePath = path.join(this.context.extensionPath, localeFileName);
            
            // 读取语言文件
            const fs = require('fs');
            if (fs.existsSync(localeFilePath)) {
                const content = fs.readFileSync(localeFilePath, 'utf8');
                this.messages = JSON.parse(content);
            } else {
                // 如果文件不存在，使用默认的英文消息
                this.loadDefaultMessages();
            }
        } catch (error) {
            console.error('加载语言文件失败:', error);
            this.loadDefaultMessages();
        }
    }

    /**
     * 加载默认的英文消息
     */
    private loadDefaultMessages(): void {
        this.messages = {
            'command.toggleDisplay': 'Toggle Token Count Display',
            'command.openSettings': 'Open Token Counter Settings',
            'config.enabled': 'Enable Token Counter functionality',
            'config.tokenizerType': 'Select tokenizer type',
            'config.warningThreshold': 'Warning threshold: Show yellow warning when token count exceeds this value',
            'config.dangerThreshold': 'Danger threshold: Show red warning when token count exceeds this value',
            'config.showInStatusBar': 'Show token count in status bar',
            'config.updateMode': 'Update mode: Choose how frequently token count updates',
            'statusBar.tokens': 'tokens',
            'statusBar.selected': 'selected',
            'statusBar.file': 'file',
            'statusBar.noContent': 'no content',
            'statusBar.calculating': 'calculating...',
            'notification.thresholdExceeded': 'Token count has exceeded threshold',
            'notification.configUpdated': 'Configuration updated',
            'notification.displayEnabled': 'Token counter display enabled',
            'notification.displayDisabled': 'Token counter display disabled'
        };
    }

    /**
     * 获取本地化的消息文本
     * @param key 消息键名
     * @param defaultValue 默认值
     * @returns 本地化的文本
     */
    public getMessage(key: string, defaultValue?: string): string {
        const message = this.messages[key];
        if (message !== undefined) {
            return message;
        }
        
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        
        // 如果没有找到对应的消息且没有提供默认值，返回键名本身
        console.warn(`未找到消息键: ${key}`);
        return key;
    }

    /**
     * 获取带参数的本地化消息
     * @param key 消息键名
     * @param params 参数对象
     * @returns 本地化的文本
     */
    public getMessageWithParams(key: string, params: { [key: string]: string | number }): string {
        let message = this.getMessage(key);
        
        // 替换参数占位符
        for (const [paramKey, paramValue] of Object.entries(params)) {
            const placeholder = `{${paramKey}}`;
            message = message.replace(new RegExp(placeholder, 'g'), String(paramValue));
        }
        
        return message;
    }

    /**
     * 获取当前语言环境
     * @returns 当前语言代码
     */
    public getCurrentLocale(): string {
        return this.currentLocale;
    }

    /**
     * 切换语言环境
     * @param locale 新的语言代码
     */
    public switchLocale(locale: string): void {
        if (this.currentLocale !== locale) {
            this.currentLocale = locale;
            this.loadMessages();
        }
    }

    /**
     * 获取支持的语言列表
     * @returns 支持的语言数组
     */
    public getSupportedLocales(): Array<{ code: string; name: string; nativeName: string }> {
        return [
            {
                code: 'en',
                name: 'English',
                nativeName: 'English'
            },
            {
                code: 'zh-cn',
                name: 'Chinese (Simplified)',
                nativeName: '简体中文'
            }
        ];
    }

    /**
     * 检查指定的语言是否被支持
     * @param locale 语言代码
     * @returns 是否支持
     */
    public isLocaleSupported(locale: string): boolean {
        const supportedLocales = this.getSupportedLocales().map(l => l.code);
        return supportedLocales.includes(locale.toLowerCase());
    }

    /**
     * 获取语言的显示名称
     * @param locale 语言代码
     * @param inNativeLanguage 是否返回该语言的本地名称
     * @returns 语言显示名称
     */
    public getLocaleDisplayName(locale: string, inNativeLanguage: boolean = false): string {
        const localeInfo = this.getSupportedLocales().find(l => l.code === locale.toLowerCase());
        
        if (localeInfo) {
            return inNativeLanguage ? localeInfo.nativeName : localeInfo.name;
        }
        
        return locale;
    }

    /**
     * 重新加载当前语言的消息
     */
    public reloadMessages(): void {
        this.loadMessages();
    }

    /**
     * 获取所有已加载的消息
     * @returns 消息对象
     */
    public getAllMessages(): { [key: string]: string } {
        return { ...this.messages };
    }

    /**
     * 检查指定的消息键是否存在
     * @param key 消息键名
     * @returns 是否存在
     */
    public hasMessage(key: string): boolean {
        return this.messages.hasOwnProperty(key);
    }

    /**
     * 格式化数字
     * 根据当前语言环境格式化数字显示
     * @param number 要格式化的数字
     * @returns 格式化后的字符串
     */
    public formatNumber(number: number): string {
        try {
            // 根据语言环境格式化数字
            if (this.currentLocale === 'zh-cn') {
                return number.toLocaleString('zh-CN');
            } else {
                return number.toLocaleString('en-US');
            }
        } catch (error) {
            // 如果格式化失败，返回原始数字字符串
            return number.toString();
        }
    }

    /**
     * 格式化Token数量的显示文本
     * @param count Token数量
     * @param isSelection 是否为选择的文本
     * @returns 格式化后的显示文本
     */
    public formatTokenCount(count: number, isSelection: boolean = false): string {
        const formattedCount = this.formatNumber(count);
        const tokensText = this.getMessage('statusBar.tokens');
        const prefix = isSelection 
            ? this.getMessage('statusBar.selected')
            : this.getMessage('statusBar.file');
        
        return `${prefix}: ${formattedCount} ${tokensText}`;
    }

    /**
     * 获取错误消息的本地化文本
     * @param errorType 错误类型
     * @param details 错误详情
     * @returns 本地化的错误消息
     */
    public getErrorMessage(errorType: string, details?: string): string {
        const errorMessages: { [key: string]: string } = {
            'tokenizer_error': this.currentLocale === 'zh-cn' ? '分词器错误' : 'Tokenizer error',
            'config_error': this.currentLocale === 'zh-cn' ? '配置错误' : 'Configuration error',
            'file_error': this.currentLocale === 'zh-cn' ? '文件读取错误' : 'File reading error',
            'unknown_error': this.currentLocale === 'zh-cn' ? '未知错误' : 'Unknown error'
        };

        let message = errorMessages[errorType] || errorMessages['unknown_error'];
        
        if (details) {
            message += this.currentLocale === 'zh-cn' ? `：${details}` : `: ${details}`;
        }
        
        return message;
    }
}
