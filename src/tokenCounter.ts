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
        // 基本输入验证
        if (!text) {
            return 0;
        }
        
        // 对于只包含空白字符的文本，返回0
        if (!text.trim()) {
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
        // 对于GPT模型，通常1个Token约等于0.75个英文单词或1.5个中文字符
        
        // 计算英文单词数量（改进正则，包含连字符和撇号）
        const englishWords = text.match(/\b[a-zA-Z]+(?:[-'][a-zA-Z]+)*\b/g) || [];
        
        // 计算中文字符数量（修正字符范围，只包含基本汉字）
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
        
        // 计算数字（包含小数和负数）
        const numbers = text.match(/-?\d+(?:\.\d+)?/g) || [];
        
        // 计算标点符号和特殊字符（排除已计算的字符）
        const symbols = text.match(/[^\w\s\u4e00-\u9fa5.-]/g) || [];
        
        // 估算Token数量（基于GPT系列的实际分词特性调整系数）
        const englishTokens = Math.ceil(englishWords.length * 1.0); // 英文单词基本1:1对应Token
        const chineseTokens = Math.ceil(chineseChars.length / 1.5); // 中文字符约1.5个字符1个Token
        const numberTokens = numbers.length;
        const symbolTokens = Math.ceil(symbols.length * 0.3); // 符号通常压缩率较高
        
        return englishTokens + chineseTokens + numberTokens + symbolTokens;
    }

    /**
     * Claude模型的Token计数
     * @param text 文本内容
     * @returns Token数量
     */
    private countClaudeTokens(text: string): number {
        // Claude的分词方式与GPT类似，但对中文和符号的处理略有不同
        
        const englishWords = text.match(/\b[a-zA-Z]+(?:[-'][a-zA-Z]+)*\b/g) || [];
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
        const numbers = text.match(/-?\d+(?:\.\d+)?/g) || [];
        const symbols = text.match(/[^\w\s\u4e00-\u9fa5.-]/g) || [];
        
        // Claude的Token计算相对保守，对中文处理更精细
        const englishTokens = Math.ceil(englishWords.length * 1.0);
        const chineseTokens = Math.ceil(chineseChars.length / 1.3); // Claude对中文分词更细致
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
        
        const englishWords = text.match(/\b[a-zA-Z]+(?:[-'][a-zA-Z]+)*\b/g) || [];
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
        const numbers = text.match(/-?\d+(?:\.\d+)?/g) || [];
        const symbols = text.match(/[^\w\s\u4e00-\u9fa5.-]/g) || [];
        
        // LLaMA对于子词的分割更细，特别是对长单词和复合词
        const englishTokens = Math.ceil(englishWords.length * 1.2);
        const chineseTokens = Math.ceil(chineseChars.length / 1.2); // LLaMA对中文的Token化相对较细
        const numberTokens = Math.ceil(numbers.length * 1.1);
        const symbolTokens = Math.ceil(symbols.length * 0.5);
        
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
        
        // 计算中文词汇（修正字符范围，使用更精确的汉字范围）
        const chineseText = text.replace(/[^\u4e00-\u9fa5]/g, '');
        // 中文分词按双字词为主，但考虑单字词的情况
        wordCount += Math.ceil(chineseText.length / 1.8); // 平均词长约1.8字符
        
        // 计算英文单词（改进正则表达式）
        const englishWords = text.match(/\b[a-zA-Z]+(?:[-'][a-zA-Z]+)*\b/g) || [];
        wordCount += englishWords.length;
        
        // 计算数字（包含小数和负数）
        const numbers = text.match(/-?\d+(?:\.\d+)?/g) || [];
        wordCount += numbers.length;
        
        // 计算中文标点符号（扩展范围，包含常用中文标点）
        const chinesePunctuation = text.match(/[，。；：？！""''（）【】《》〈〉「」『』、·]/g) || [];
        const otherPunctuation = text.match(/[^\w\s\u4e00-\u9fa5，。；：？！""''（）【】《》〈〉「」『』、·.-]/g) || [];
        wordCount += chinesePunctuation.length;
        wordCount += Math.ceil(otherPunctuation.length * 0.5); // 其他标点压缩计算
        
        return Math.max(1, wordCount); // 确保至少返回1
    }

    /**
     * 简单单词计数
     * 基于空格和标点符号的简单分词
     * @param text 文本内容
     * @returns 单词数量
     */
    private countSimpleWords(text: string): number {
        // 移除多余的空白字符并分割
        const trimmedText = text.trim();
        if (!trimmedText) {
            return 0;
        }
        
        const words = trimmedText.split(/\s+/).filter(word => word.length > 0);
        
        // 对于包含中文的文本，需要特殊处理
        let totalCount = 0;
        
        for (const word of words) {
            // 检查是否包含中文字符（使用精确的汉字范围）
            if (/[\u4e00-\u9fa5]/.test(word)) {
                // 包含中文字符的词，分离中文和非中文部分
                const chineseChars = word.match(/[\u4e00-\u9fa5]/g) || [];
                const nonChineseText = word.replace(/[\u4e00-\u9fa5]/g, '').trim();
                
                // 中文字符按字符数计算
                totalCount += chineseChars.length;
                
                // 非中文部分如果有内容，算作一个单词
                if (nonChineseText) {
                    // 进一步分析非中文部分是否包含多个单词
                    const nonChineseWords = nonChineseText.split(/[^\w.-]+/).filter(w => w.length > 0);
                    totalCount += Math.max(1, nonChineseWords.length);
                }
            } else {
                // 纯英文或其他字符的词
                totalCount += 1;
            }
        }
        
        return Math.max(1, totalCount); // 确保至少返回1
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
