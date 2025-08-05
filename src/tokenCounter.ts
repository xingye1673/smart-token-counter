import { ConfigManager } from './configManager';

/**
 * Token计数器核心类
 * 负责根据不同的分词方案计算文本的Token数量
 */
export class TokenCounter {
    private configManager: ConfigManager;

    constructor(configManager: ConfigManager) {
        this.configManager = configManager;
    }

    /**
     * 根据配置的分词器类型计算文本的Token数量
     * @param text 要计算的文本内容
     * @returns Token数量
     */
    public countTokens(text: string): number {
        if (!text || text.trim().length === 0) {
            return 0;
        }

        const tokenizerType = this.configManager.get('tokenizerType') || 'gpt-3.5-turbo';
        
        try {
            switch (tokenizerType) {
                case 'gpt-3.5-turbo':
                case 'gpt-4':
                    return this.countGPTTokens(text);
                case 'claude':
                    return this.countClaudeTokens(text);
                case 'llama':
                    return this.countLlamaTokens(text);
                case 'chinese-word-count':
                    return this.countChineseWords(text);
                case 'simple-word-count':
                    return this.countSimpleWords(text);
                default:
                    return this.countGPTTokens(text);
            }
        } catch (error) {
            console.error('Token计数时发生错误:', error);
            // 出错时回退到简单单词计数
            return this.countSimpleWords(text);
        }
    }

    /**
     * GPT系列模型的Token计数
     * 使用近似的计算方法，因为tiktoken库可能不可用
     * @param text 文本内容
     * @returns Token数量
     */
    private countGPTTokens(text: string): number {
        // 这是一个近似计算方法
        // 对于GPT模型，通常1个Token约等于0.75个英文单词或0.5个中文字符
        
        // 计算英文单词数量
        const englishWords = text.match(/\b[a-zA-Z]+\b/g) || [];
        
        // 计算中文字符数量
        const chineseChars = text.match(/[\u4e00-\u9fff]/g) || [];
        
        // 计算数字和符号
        const numbers = text.match(/\d+/g) || [];
        const symbols = text.match(/[^\w\s\u4e00-\u9fff]/g) || [];
        
        // 估算Token数量
        const englishTokens = Math.ceil(englishWords.length * 1.3); // 英文单词通常比Token多
        const chineseTokens = Math.ceil(chineseChars.length * 0.5); // 中文字符通常2个字符约1个Token
        const numberTokens = numbers.length;
        const symbolTokens = Math.ceil(symbols.length * 0.5);
        
        return englishTokens + chineseTokens + numberTokens + symbolTokens;
    }

    /**
     * Claude模型的Token计数
     * @param text 文本内容
     * @returns Token数量
     */
    private countClaudeTokens(text: string): number {
        // Claude的分词方式与GPT类似，但略有不同
        // 这里使用一个调整后的计算方法
        
        const englishWords = text.match(/\b[a-zA-Z]+\b/g) || [];
        const chineseChars = text.match(/[\u4e00-\u9fff]/g) || [];
        const numbers = text.match(/\d+/g) || [];
        const symbols = text.match(/[^\w\s\u4e00-\u9fff]/g) || [];
        
        // Claude的Token计算稍微保守一些
        const englishTokens = Math.ceil(englishWords.length * 1.2);
        const chineseTokens = Math.ceil(chineseChars.length * 0.6);
        const numberTokens = numbers.length;
        const symbolTokens = Math.ceil(symbols.length * 0.4);
        
        return englishTokens + chineseTokens + numberTokens + symbolTokens;
    }

    /**
     * LLaMA模型的Token计数
     * @param text 文本内容
     * @returns Token数量
     */
    private countLlamaTokens(text: string): number {
        // LLaMA使用SentencePiece分词器，这里提供一个近似计算
        
        const englishWords = text.match(/\b[a-zA-Z]+\b/g) || [];
        const chineseChars = text.match(/[\u4e00-\u9fff]/g) || [];
        const numbers = text.match(/\d+/g) || [];
        const symbols = text.match(/[^\w\s\u4e00-\u9fff]/g) || [];
        
        // LLaMA对于子词的分割更细
        const englishTokens = Math.ceil(englishWords.length * 1.4);
        const chineseTokens = Math.ceil(chineseChars.length * 0.8);
        const numberTokens = Math.ceil(numbers.length * 1.2);
        const symbolTokens = symbols.length;
        
        return englishTokens + chineseTokens + numberTokens + symbolTokens;
    }

    /**
     * 中文分词计数
     * 针对中文文本的专门计数方法
     * @param text 文本内容
     * @returns 词汇数量
     */
    private countChineseWords(text: string): number {
        // 中文分词的简化实现
        // 实际项目中可以集成更专业的中文分词库如jieba
        
        let wordCount = 0;
        
        // 计算中文词汇（按双字词为主）
        const chineseText = text.replace(/[^\u4e00-\u9fff]/g, '');
        wordCount += Math.ceil(chineseText.length / 2);
        
        // 计算英文单词
        const englishWords = text.match(/\b[a-zA-Z]+\b/g) || [];
        wordCount += englishWords.length;
        
        // 计算数字
        const numbers = text.match(/\d+/g) || [];
        wordCount += numbers.length;
        
        // 计算标点符号
        const punctuation = text.match(/[，。；：？！""''（）【】]/g) || [];
        wordCount += punctuation.length;
        
        return wordCount;
    }

    /**
     * 简单单词计数
     * 基于空格和标点符号的简单分词
     * @param text 文本内容
     * @returns 单词数量
     */
    private countSimpleWords(text: string): number {
        // 移除多余的空白字符并分割
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        
        // 对于包含中文的文本，需要特殊处理
        let totalCount = 0;
        
        for (const word of words) {
            if (/[\u4e00-\u9fff]/.test(word)) {
                // 包含中文字符的词，按字符数计算
                const chineseChars = word.match(/[\u4e00-\u9fff]/g) || [];
                const otherChars = word.replace(/[\u4e00-\u9fff]/g, '');
                totalCount += chineseChars.length;
                if (otherChars.trim()) {
                    totalCount += 1; // 其他字符算作一个单词
                }
            } else {
                // 纯英文或其他字符的词
                totalCount += 1;
            }
        }
        
        return totalCount;
    }

    /**
     * 获取当前配置
     * @returns 配置对象
     */
    public getConfig(): any {
        return {
            tokenizerType: this.configManager.get('tokenizerType'),
            warningThreshold: this.configManager.get('warningThreshold'),
            dangerThreshold: this.configManager.get('dangerThreshold')
        };
    }

    /**
     * 获取支持的分词器类型列表
     * @returns 分词器类型数组
     */
    public static getSupportedTokenizers(): string[] {
        return [
            'gpt-3.5-turbo',
            'gpt-4',
            'claude',
            'llama',
            'chinese-word-count',
            'simple-word-count'
        ];
    }

    /**
     * 获取指定分词器的描述信息
     * @param tokenizerType 分词器类型
     * @returns 描述信息
     */
    public static getTokenizerDescription(tokenizerType: string): string {
        const descriptions: { [key: string]: string } = {
            'gpt-3.5-turbo': 'GPT-3.5 Turbo模型分词器（使用cl100k_base编码）',
            'gpt-4': 'GPT-4模型分词器（使用cl100k_base编码）',
            'claude': 'Claude模型分词器',
            'llama': 'LLaMA模型分词器（SentencePiece）',
            'chinese-word-count': '中文分词计数器',
            'simple-word-count': '简单单词计数器'
        };
        
        return descriptions[tokenizerType] || '未知分词器类型';
    }
}
