import * as vscode from 'vscode';

/**
 * 配置管理器
 * 负责读取和更新插件的配置项
 */
export class ConfigManager {
    private readonly configSection = 'smartTokenCounter';

    /**
     * 获取指定配置项的值
     * @param key 配置键名
     * @returns 配置值
     */
    public get<T>(key: string): T {
        const config = vscode.workspace.getConfiguration(this.configSection);
        return config.get<T>(key) as T;
    }

    /**
     * 更新指定配置项的值
     * @param key 配置键名
     * @param value 新的配置值
     * @param target 配置目标（全局或工作区）
     */
    public async update<T>(
        key: string, 
        value: T, 
        target: vscode.ConfigurationTarget = vscode.ConfigurationTarget.Global
    ): Promise<void> {
        const config = vscode.workspace.getConfiguration(this.configSection);
        await config.update(key, value, target);
    }

    /**
     * 获取所有配置项
     * @returns 包含所有配置的对象
     */
    public getAll(): any {
        const config = vscode.workspace.getConfiguration(this.configSection);
        return {
            enabled: config.get<boolean>('enabled', true),
            tokenizerType: config.get<string>('tokenizerType', 'gpt-3.5-turbo'),
            warningThreshold: config.get<number>('warningThreshold', 4000),
            dangerThreshold: config.get<number>('dangerThreshold', 8000),
            showInStatusBar: config.get<boolean>('showInStatusBar', true),
            updateMode: config.get<string>('updateMode', 'realtime')
        };
    }

    /**
     * 重新加载配置
     * 当配置发生变化时调用此方法
     */
    public reload(): void {
        // 配置会自动重新加载，这里可以添加额外的逻辑
        console.log('配置已重新加载');
    }

    /**
     * 检查配置是否有效
     * @returns 是否有效
     */
    public isValid(): boolean {
        const config = this.getAll();
        
        // 检查阈值设置是否合理
        if (config.warningThreshold >= config.dangerThreshold) {
            return false;
        }
        
        // 检查分词器类型是否支持
        const supportedTokenizers = [
            'gpt-3.5-turbo',
            'gpt-4',
            'claude',
            'llama',
            'chinese-word-count',
            'simple-word-count'
        ];
        
        if (!supportedTokenizers.includes(config.tokenizerType)) {
            return false;
        }
        
        // 检查更新模式是否支持
        const supportedUpdateModes = ['realtime', 'onSave', 'manual'];
        if (!supportedUpdateModes.includes(config.updateMode)) {
            return false;
        }
        
        return true;
    }

    /**
     * 重置配置到默认值
     */
    public async resetToDefaults(): Promise<void> {
        const defaultConfig = {
            enabled: true,
            tokenizerType: 'gpt-3.5-turbo',
            warningThreshold: 4000,
            dangerThreshold: 8000,
            showInStatusBar: true,
            updateMode: 'realtime'
        };

        for (const [key, value] of Object.entries(defaultConfig)) {
            await this.update(key, value);
        }
    }

    /**
     * 获取配置项的架构信息
     * @param key 配置键名
     * @returns 架构信息
     */
    public getConfigSchema(key: string): any {
        const schemas: { [key: string]: any } = {
            enabled: {
                type: 'boolean',
                default: true,
                description: '是否启用Token计数器功能'
            },
            tokenizerType: {
                type: 'string',
                enum: [
                    'gpt-3.5-turbo',
                    'gpt-4',
                    'claude',
                    'llama',
                    'chinese-word-count',
                    'simple-word-count'
                ],
                default: 'gpt-3.5-turbo',
                description: '选择分词器类型'
            },
            warningThreshold: {
                type: 'number',
                default: 4000,
                minimum: 100,
                description: '警告阈值：Token数量超过此值时显示黄色警告'
            },
            dangerThreshold: {
                type: 'number',
                default: 8000,
                minimum: 100,
                description: '危险阈值：Token数量超过此值时显示红色警告'
            },
            showInStatusBar: {
                type: 'boolean',
                default: true,
                description: '是否在状态栏显示Token计数'
            },
            updateMode: {
                type: 'string',
                enum: ['realtime', 'onSave', 'manual'],
                default: 'realtime',
                description: '更新模式：选择Token计数的更新频率'
            }
        };

        return schemas[key] || null;
    }

    /**
     * 监听配置变化
     * @param callback 配置变化时的回调函数
     * @returns 可释放的监听器
     */
    public onConfigurationChanged(
        callback: (event: vscode.ConfigurationChangeEvent) => void
    ): vscode.Disposable {
        return vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration(this.configSection)) {
                callback(event);
            }
        });
    }

    /**
     * 导出当前配置
     * @returns 配置的JSON字符串
     */
    public exportConfig(): string {
        const config = this.getAll();
        return JSON.stringify(config, null, 2);
    }

    /**
     * 导入配置
     * @param configJson 配置的JSON字符串
     */
    public async importConfig(configJson: string): Promise<void> {
        try {
            const config = JSON.parse(configJson);
            
            for (const [key, value] of Object.entries(config)) {
                if (this.getConfigSchema(key)) {
                    await this.update(key, value);
                }
            }
            
            console.log('配置导入成功');
        } catch (error) {
            console.error('配置导入失败:', error);
            throw new Error('无效的配置格式');
        }
    }
}
