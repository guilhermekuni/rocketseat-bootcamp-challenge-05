import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeTransactions = this.transactions.filter(
      item => item.type === 'income',
    );

    const outcomeTransactions = this.transactions.filter(
      item => item.type === 'outcome',
    );

    const income = incomeTransactions.reduce(
      (total, transaction) => total + transaction.value,
      0,
    );

    const outcome = outcomeTransactions.reduce(
      (total, transaction) => total + transaction.value,
      0,
    );

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    if (type === 'outcome' && value > this.getBalance().total) {
      throw Error('The outcome value can not be bigger than income value.');
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
