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
    const income = this.transactions.reduce((acumulator, arrayValue) => {
      if (arrayValue.type === 'income') {
        return acumulator + arrayValue.value;
      }
      return acumulator;
    }, 0);
    const outcome = this.transactions.reduce((acumulator, arrayValue) => {
      if (arrayValue.type === 'outcome') {
        return acumulator + arrayValue.value;
      }
      return acumulator;
    }, 0);

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (type === 'outcome') {
      const balance = this.getBalance();

      if (balance.total < value) {
        throw Error('The outcome cannot be less than the income.');
      }
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
