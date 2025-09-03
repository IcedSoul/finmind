export interface ParsedBillData {
  time: string;
  channel: string;
  merchant: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  confidence: number;
}

export interface AIParseResult {
  success: boolean;
  data: ParsedBillData[];
  message?: string;
}

class AIService {
  private isModelLoaded = false;

  async initializeModel(): Promise<boolean> {
    try {
      console.log('Initializing AI model...');
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      this.isModelLoaded = true;
      console.log('AI model initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize AI model:', error);
      return false;
    }
  }

  async parseBillFile(
    fileContent: string,
    fileType: 'csv' | 'excel' | 'pdf',
  ): Promise<AIParseResult> {
    try {
      if (!this.isModelLoaded) {
        await this.initializeModel();
      }

      console.log(`Parsing ${fileType} file with AI model...`);

      await new Promise<void>(resolve => setTimeout(resolve, 2000));

      const mockParsedData: ParsedBillData[] =
        this.generateMockData(fileContent);

      return {
        success: true,
        data: mockParsedData,
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.message || 'AI parsing failed',
      };
    }
  }

  async parseTextContent(text: string): Promise<AIParseResult> {
    try {
      if (!this.isModelLoaded) {
        await this.initializeModel();
      }

      console.log('Parsing text content with AI model...');

      await new Promise<void>(resolve => setTimeout(resolve, 1500));

      const mockParsedData: ParsedBillData[] = this.extractBillsFromText(text);

      return {
        success: true,
        data: mockParsedData,
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.message || 'Text parsing failed',
      };
    }
  }

  private generateMockData(_fileContent: string): ParsedBillData[] {
    const mockData: ParsedBillData[] = [
      {
        time: '2024-01-15T12:30:00Z',
        channel: '支付宝',
        merchant: '星巴克咖啡',
        type: 'expense',
        amount: 35.0,
        category: '餐饮',
        confidence: 0.95,
      },
      {
        time: '2024-01-15T18:45:00Z',
        channel: '微信支付',
        merchant: '滴滴出行',
        type: 'expense',
        amount: 18.5,
        category: '交通',
        confidence: 0.92,
      },
      {
        time: '2024-01-16T10:00:00Z',
        channel: '银行转账',
        merchant: '工资收入',
        type: 'income',
        amount: 8000.0,
        category: '工资',
        confidence: 0.98,
      },
    ];

    return mockData;
  }

  private extractBillsFromText(text: string): ParsedBillData[] {
    const lines = text.split('\n').filter(line => line.trim());
    const bills: ParsedBillData[] = [];

    for (const line of lines) {
      if (this.containsBillInfo(line)) {
        const parsed = this.parseBillLine(line);
        if (parsed) {
          bills.push(parsed);
        }
      }
    }

    return bills.length > 0 ? bills : this.generateMockData(text);
  }

  private containsBillInfo(line: string): boolean {
    const keywords = [
      '支付',
      '收入',
      '转账',
      '消费',
      '¥',
      '元',
      '支付宝',
      '微信',
    ];
    return keywords.some(keyword => line.includes(keyword));
  }

  private parseBillLine(line: string): ParsedBillData | null {
    const amountMatch = line.match(/[¥￥]?([0-9]+\.?[0-9]*)/);
    const timeMatch = line.match(/(\d{4}-\d{2}-\d{2}|\d{2}-\d{2}|\d{2}:\d{2})/);

    if (amountMatch) {
      return {
        time: timeMatch
          ? this.normalizeTime(timeMatch[1])
          : new Date().toISOString(),
        channel: this.extractChannel(line),
        merchant: this.extractMerchant(line),
        type: this.determineType(line),
        amount: parseFloat(amountMatch[1]),
        category: this.categorizeTransaction(line),
        confidence: 0.85,
      };
    }

    return null;
  }

  private normalizeTime(timeStr: string): string {
    if (timeStr.includes('-') && timeStr.length === 10) {
      return `${timeStr}T12:00:00Z`;
    }
    if (timeStr.includes(':')) {
      const today = new Date().toISOString().split('T')[0];
      return `${today}T${timeStr}:00Z`;
    }
    return new Date().toISOString();
  }

  private extractChannel(line: string): string {
    if (line.includes('支付宝')) return '支付宝';
    if (line.includes('微信')) return '微信支付';
    if (line.includes('银行')) return '银行卡';
    return '其他';
  }

  private extractMerchant(line: string): string {
    const merchants = ['星巴克', '麦当劳', '滴滴', '美团', '淘宝', '京东'];
    for (const merchant of merchants) {
      if (line.includes(merchant)) {
        return merchant;
      }
    }
    return '未知商户';
  }

  private determineType(line: string): 'income' | 'expense' {
    const incomeKeywords = ['收入', '工资', '转入', '退款'];
    const expenseKeywords = ['支付', '消费', '转出', '购买'];

    if (incomeKeywords.some(keyword => line.includes(keyword))) {
      return 'income';
    }
    if (expenseKeywords.some(keyword => line.includes(keyword))) {
      return 'expense';
    }
    return 'expense';
  }

  private categorizeTransaction(line: string): string {
    const categories = {
      餐饮: ['餐', '咖啡', '星巴克', '麦当劳', '美食'],
      交通: ['滴滴', '出租', '地铁', '公交', '打车'],
      购物: ['淘宝', '京东', '购物', '商城'],
      娱乐: ['电影', '游戏', '娱乐'],
      医疗: ['医院', '药店', '医疗'],
      工资: ['工资', '薪水', '收入'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => line.includes(keyword))) {
        return category;
      }
    }
    return '其他';
  }

  getModelStatus(): { loaded: boolean; version: string } {
    return {
      loaded: this.isModelLoaded,
      version: '1.0.0-mock',
    };
  }
}

export const aiService = new AIService();
