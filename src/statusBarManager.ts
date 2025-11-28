import * as vscode from 'vscode';
import { I18nProvider } from './i18nProvider';
import { ConfigManager } from './configManager';

/**
 * 状态栏管理器
 * 负责在VSCode状态栏中显示Token计数信息
 */
export class StatusBarManager implements vscode.Disposable {
    private statusBarItem: vscode.StatusBarItem;
    private i18nProvider: I18nProvider;
    private configManager: ConfigManager;
    private updateTimeout: NodeJS.Timeout | undefined;
    private lastText: string = '';

    constructor(
        context: vscode.ExtensionContext,
        i18nProvider: I18nProvider,
        configManager: ConfigManager
    ) {
        this.i18nProvider = i18nProvider;
        this.configManager = configManager;

        // 创建状态栏项目
        this.statusBarItem = vscode.window.createStatusBarItem(
            'smart-token-counter',
            vscode.StatusBarAlignment.Right,
            100
        );

        // 设置状态栏项目的基本属性
        this.statusBarItem.name = 'Smart Token Counter';
        this.statusBarItem.tooltip = '点击打开Token计数器设置';
        this.statusBarItem.command = 'smart-token-counter.openSettings';

        // 如果配置启用了状态栏显示，则显示状态栏项目
        if (this.configManager.get('showInStatusBar')) {
            this.show();
        }
    }

    /**
     * 更新状态栏显示内容（带防抖功能）
     * @param text 要显示的文本
     * @param colorState 颜色状态
     * @param isSelection 是否为选择的文本
     * @param fileTokenCount 文件总Token数（选择时用于显示对比）
     */
    public updateDisplay(text: string, colorState: 'normal' | 'warning' | 'danger' | 'error', isSelection?: boolean, fileTokenCount?: number): void {
        if (!this.configManager.get('showInStatusBar')) {
            this.hide();
            return;
        }

        // 如果文本相同，避免无意义的更新
        if (this.lastText === text) {
            return;
        }

        this.lastText = text;

        // 清除之前的延迟更新
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }

        // 延迟更新以减少频繁刷新造成的闪烁
        this.updateTimeout = setTimeout(() => {
            this._doUpdateDisplay(text, colorState, isSelection, fileTokenCount);
        }, 50);
    }

    /**
     * 立即更新状态栏显示内容（无防抖）
     * @param text 要显示的文本
     * @param colorState 颜色状态
     * @param isSelection 是否为选择的文本
     * @param fileTokenCount 文件总Token数（选择时用于显示对比）
     */
    private _doUpdateDisplay(text: string, colorState: 'normal' | 'warning' | 'danger' | 'error', isSelection?: boolean, fileTokenCount?: number): void {
        // 根据是否启用颜色警告决定是否应用颜色
        const shouldApplyColor = this.configManager.get('enableColorWarning') !== false;
        const effectiveColorState = shouldApplyColor ? colorState : 'normal';
        
        // 设置状态栏文本，使用动态图标和新格式
        const icon = isSelection ? '$(selection)' : '$(file-code)';
        this.statusBarItem.text = `${icon} ${text}`;
        this.statusBarItem.backgroundColor = this.getBackgroundColor(effectiveColorState);
        this.statusBarItem.color = this.getTextColor(effectiveColorState);
        
        // 更新工具提示
        this.updateTooltip(text, colorState, isSelection, fileTokenCount);
        
        this.show();
    }

    /**
     * 显示状态栏项目
     */
    public show(): void {
        this.statusBarItem.show();
    }

    /**
     * 隐藏状态栏项目
     */
    public hide(): void {
        this.statusBarItem.hide();
    }

    /**
     * 根据颜色状态获取背景色
     * @param colorState 颜色状态
     * @returns 背景色主题颜色
     */
    private getBackgroundColor(colorState: 'normal' | 'warning' | 'danger' | 'error'): vscode.ThemeColor | undefined {
        switch (colorState) {
            case 'warning':
                return new vscode.ThemeColor('statusBarItem.warningBackground');
            case 'danger':
                return new vscode.ThemeColor('statusBarItem.errorBackground');
            case 'error':
                return new vscode.ThemeColor('statusBarItem.errorBackground');
            default:
                return undefined; // 使用默认背景色
        }
    }

    /**
     * 根据颜色状态获取文本颜色
     * @param colorState 颜色状态
     * @returns 文本颜色主题颜色
     */
    private getTextColor(colorState: 'normal' | 'warning' | 'danger' | 'error'): vscode.ThemeColor | undefined {
        switch (colorState) {
            case 'warning':
                return new vscode.ThemeColor('statusBarItem.warningForeground');
            case 'danger':
                return new vscode.ThemeColor('statusBarItem.errorForeground');
            case 'error':
                return new vscode.ThemeColor('statusBarItem.errorForeground');
            default:
                return undefined; // 使用默认文本颜色
        }
    }

    /**
     * 更新工具提示信息
     * @param text 当前显示的文本
     * @param colorState 颜色状态
     * @param isSelection 是否为选择的文本
     * @param fileTokenCount 文件总Token数（选择时用于显示对比）
     */
    private updateTooltip(text: string, colorState: 'normal' | 'warning' | 'danger' | 'error', isSelection?: boolean, fileTokenCount?: number): void {
        let tooltip = `智能Token计数器\n\n当前: ${text}`;
        
        // 如果是选择模式且有文件总数，显示对比信息
        if (isSelection && fileTokenCount !== undefined) {
            tooltip += `\n文件总计: ${this.formatTokenCount(fileTokenCount)} T`;
        }
        
        const config = this.configManager.getAll();
        tooltip += `\n分词器: ${this.getTokenizerDisplayName(config.tokenizerType)}`;
        tooltip += `\n提醒阈值: ${config.warningThreshold}`;
        tooltip += `\n关注阈值: ${config.dangerThreshold}`;
        
        // 根据颜色状态添加提示信息
        switch (colorState) {
            case 'warning':
                tooltip += `\n\n💡 Token数量已超过提醒阈值`;
                break;
            case 'danger':
                tooltip += `\n\n🔥 Token数量已超过关注阈值`;
                break;
            case 'error':
                tooltip += `\n\n❌ 计算过程中发生错误`;
                break;
        }
        
        tooltip += `\n\n点击打开设置页面`;
        
        this.statusBarItem.tooltip = tooltip;
    }

    /**
     * 获取分词器的显示名称
     * @param tokenizerType 分词器类型
     * @returns 显示名称
     */
    private getTokenizerDisplayName(tokenizerType: string): string {
        const displayNames: { [key: string]: string } = {
            'gpt-3.5-turbo': 'GPT-3.5 Turbo',
            'gpt-4': 'GPT-4',
            'claude': 'Claude',
            'llama': 'LLaMA',
            'chinese-word-count': '中文分词',
            'simple-word-count': '简单分词'
        };
        
        return displayNames[tokenizerType] || tokenizerType;
    }

    /**
     * 格式化Token数量显示
     * @param tokenCount Token数量
     * @returns 格式化后的数量字符串
     */
    private formatTokenCount(tokenCount: number): string {
        if (tokenCount >= 1000000) {
            return `${(tokenCount / 1000000).toFixed(1)}M`;
        } else if (tokenCount >= 1000) {
            return `${(tokenCount / 1000).toFixed(1)}K`;
        } else {
            return tokenCount.toString();
        }
    }

    /**
     * 设置加载状态
     */
    public setLoadingState(): void {
        this.statusBarItem.text = `$(loading~spin) ${this.i18nProvider.getMessage('statusBar.calculating')}`;
        this.statusBarItem.backgroundColor = undefined;
        this.statusBarItem.color = undefined;
        this.statusBarItem.tooltip = '正在计算Token数量...';
        this.show();
    }

    /**
     * 设置错误状态
     * @param errorMessage 错误信息
     */
    public setErrorState(errorMessage: string): void {
        this.statusBarItem.text = `$(error) 错误`;
        this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        this.statusBarItem.color = new vscode.ThemeColor('statusBarItem.errorForeground');
        this.statusBarItem.tooltip = `Token计数器错误: ${errorMessage}\n\n点击打开设置页面`;
        this.show();
    }

    /**
     * 设置禁用状态
     */
    public setDisabledState(): void {
        this.statusBarItem.text = `$(circle-slash) 已禁用`;
        this.statusBarItem.backgroundColor = undefined;
        this.statusBarItem.color = new vscode.ThemeColor('statusBarItem.prominentForeground');
        this.statusBarItem.tooltip = `Token计数器已禁用\n\n点击打开设置页面启用`;
        this.show();
    }

    /**
     * 清除显示内容
     */
    public clear(): void {
        this.statusBarItem.text = '';
        this.statusBarItem.backgroundColor = undefined;
        this.statusBarItem.color = undefined;
        this.statusBarItem.tooltip = 'Smart Token Counter';
        this.hide();
    }

    /**
     * 刷新显示
     * 根据当前配置重新设置状态栏项目
     */
    public refresh(): void {
        if (this.configManager.get('enabled') && this.configManager.get('showInStatusBar')) {
            this.show();
        } else {
            this.hide();
        }
    }

    /**
     * 获取当前状态栏项目的可见性
     * @returns 是否可见
     */
    public isVisible(): boolean {
        return this.statusBarItem !== undefined;
    }

    /**
     * 创建状态栏上下文菜单
     * @returns 菜单项数组
     */
    public createContextMenu(): vscode.QuickPickItem[] {
        const config = this.configManager.getAll();
        
        return [
            {
                label: '$(gear) 打开设置',
                description: '配置Token计数器选项'
            },
            {
                label: config.enabled ? '$(circle-slash) 禁用' : '$(check) 启用',
                description: config.enabled ? '禁用Token计数功能' : '启用Token计数功能'
            },
            {
                label: '$(refresh) 刷新计数',
                description: '重新计算当前文件的Token数量'
            },
            {
                label: '$(info) 关于',
                description: '查看插件信息'
            }
        ];
    }

    /**
     * 释放资源
     */
    public dispose(): void {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        if (this.statusBarItem) {
            this.statusBarItem.dispose();
        }
    }
}
