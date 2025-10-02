export interface ISummaryCard {
  type: 'general' | 'card' | 'income' | 'cashflow';
  title: string;
  icon: string;
  subTitle: string;
  items?: any[];
  totalSpend?: number;
  topCategory?: { categoryName: string; total: number };
  upcoming?: string;
  balanceIn?: number;
  balanceOut?: number;
}
