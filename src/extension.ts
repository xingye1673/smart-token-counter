import * as vscode from 'vscode';
import { TokenCounter } from './tokenCounter';
import { StatusBarManager } from './statusBarManager';
import { ConfigManager } from './configManager';
import { I18nProvider } from './i18nProvider';

/**
 * 插件主入口文件
 * 负责插件的激活、注销和核心功能的协调
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('智能Token计数器插件正在激活...');

    // 初始化国际化提供器
    const i18nProvider = new I18nProvider(context);
    
    // 初始化配置管理器
    const configManager = new ConfigManager();
    
    // 初始化Token计数器
    const tokenCounter = new TokenCounter(configManager);
    
    // 初始化状态栏管理器
    const statusBarManager = new StatusBarManager(context, i18nProvider, configManager);
    
    // 注册命令：切换显示状态
    const toggleDisplayCommand = vscode.commands.registerCommand('smart-token-counter.toggleDisplay', () => {
        const currentState = configManager.get('showInStatusBar');
        configManager.update('showInStatusBar', !currentState);
        
        if (!currentState) {
            statusBarManager.show();
            vscode.window.showInformationMessage(i18nProvider.getMessage('notification.displayEnabled'));
        } else {
            statusBarManager.hide();
            vscode.window.showInformationMessage(i18nProvider.getMessage('notification.displayDisabled'));
        }
    });

    // 注册命令：打开设置页面
    const openSettingsCommand = vscode.commands.registerCommand('smart-token-counter.openSettings', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', 'smartTokenCounter');
    });

    // 监听文本编辑器变化事件
    const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && configManager.get('enabled')) {
            updateTokenCount(editor, tokenCounter, statusBarManager, i18nProvider);
        } else {
            statusBarManager.hide();
        }
    });

    // 监听文本内容变化事件
    const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument((event) => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && 
            event.document === activeEditor.document && 
            configManager.get('enabled') &&
            configManager.get('updateMode') === 'realtime') {
            updateTokenCount(activeEditor, tokenCounter, statusBarManager, i18nProvider);
        }
    });

    // 监听文本选择变化事件
    const onDidChangeTextEditorSelection = vscode.window.onDidChangeTextEditorSelection((event) => {
        if (configManager.get('enabled')) {
            updateTokenCount(event.textEditor, tokenCounter, statusBarManager, i18nProvider);
        }
    });

    // 监听文档保存事件
    const onDidSaveTextDocument = vscode.workspace.onDidSaveTextDocument((document) => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && 
            document === activeEditor.document && 
            configManager.get('enabled') &&
            configManager.get('updateMode') === 'onSave') {
            updateTokenCount(activeEditor, tokenCounter, statusBarManager, i18nProvider);
        }
    });

    // 监听配置变化事件
    const onDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('smartTokenCounter')) {
            configManager.reload();
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor && configManager.get('enabled')) {
                updateTokenCount(activeEditor, tokenCounter, statusBarManager, i18nProvider);
            } else if (!configManager.get('enabled')) {
                statusBarManager.hide();
            }
        }
    });

    // 将所有注册的对象添加到上下文中，以便在插件注销时正确清理
    context.subscriptions.push(
        toggleDisplayCommand,
        openSettingsCommand,
        onDidChangeActiveTextEditor,
        onDidChangeTextDocument,
        onDidChangeTextEditorSelection,
        onDidSaveTextDocument,
        onDidChangeConfiguration,
        statusBarManager
    );

    // 如果当前有活动的编辑器，立即更新Token计数
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && configManager.get('enabled')) {
        updateTokenCount(activeEditor, tokenCounter, statusBarManager, i18nProvider);
    }

    console.log('智能Token计数器插件激活完成');
}

/**
 * 更新Token计数显示
 * @param editor 当前活动的文本编辑器
 * @param tokenCounter Token计数器实例
 * @param statusBarManager 状态栏管理器实例
 * @param i18nProvider 国际化提供器实例
 */
function updateTokenCount(
    editor: vscode.TextEditor,
    tokenCounter: TokenCounter,
    statusBarManager: StatusBarManager,
    i18nProvider: I18nProvider
) {
    try {
        // 获取要计算的文本内容
        let text: string;
        let isSelection = false;

        if (editor.selection && !editor.selection.isEmpty) {
            // 如果有选择的文本，计算选择部分的Token数量
            text = editor.document.getText(editor.selection);
            isSelection = true;
        } else {
            // 否则计算整个文件的Token数量
            text = editor.document.getText();
            isSelection = false;
        }

        if (!text.trim()) {
            statusBarManager.updateDisplay(
                `0 ${i18nProvider.getMessage('statusBar.tokens')}`,
                'normal'
            );
            return;
        }

        // 异步计算Token数量以避免阻塞UI
        statusBarManager.updateDisplay(
            i18nProvider.getMessage('statusBar.calculating'),
            'normal'
        );

        // 使用setTimeout来异步执行Token计算，避免阻塞主线程
        setTimeout(() => {
            const tokenCount = tokenCounter.countTokens(text);
            const displayText = formatDisplayText(tokenCount, isSelection, i18nProvider);
            const colorState = getColorState(tokenCount, tokenCounter.getConfig());
            
            statusBarManager.updateDisplay(displayText, colorState);
        }, 10);

    } catch (error) {
        console.error('更新Token计数时发生错误:', error);
        statusBarManager.updateDisplay(
            `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            'error'
        );
    }
}

/**
 * 格式化显示文本
 * @param tokenCount Token数量
 * @param isSelection 是否为选择的文本
 * @param i18nProvider 国际化提供器
 * @returns 格式化后的显示文本
 */
function formatDisplayText(tokenCount: number, isSelection: boolean, i18nProvider: I18nProvider): string {
    const tokensText = i18nProvider.getMessage('statusBar.tokens');
    const prefix = isSelection 
        ? i18nProvider.getMessage('statusBar.selected')
        : i18nProvider.getMessage('statusBar.file');
    
    return `${prefix}: ${tokenCount} ${tokensText}`;
}

/**
 * 根据Token数量和配置获取颜色状态
 * @param tokenCount Token数量
 * @param config 配置对象
 * @returns 颜色状态
 */
function getColorState(tokenCount: number, config: any): 'normal' | 'warning' | 'danger' | 'error' {
    const warningThreshold = config.warningThreshold || 4000;
    const dangerThreshold = config.dangerThreshold || 8000;

    if (tokenCount >= dangerThreshold) {
        return 'danger';
    } else if (tokenCount >= warningThreshold) {
        return 'warning';
    } else {
        return 'normal';
    }
}

/**
 * 插件注销函数
 * 在插件被禁用或卸载时调用
 */
export function deactivate() {
    console.log('智能Token计数器插件正在注销...');
    // 清理工作会通过context.subscriptions自动完成
}
