
// Mock data for our payslip application

export type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  companyId: string;
};

export type Company = {
  id: string;
  name: string;
  logo?: string;
};

export type PaymentStatement = {
  id: string;
  employeeId: string;
  date: string;
  month: string;
  year: string;
  grossAmount: number;
  netAmount: number;
  currency: string;
  type: 'payslip' | 'bonus' | 'reimbursement' | 'other';
  details: PaymentDetail[];
  status: 'paid' | 'processing' | 'pending';
};

export type PaymentDetail = {
  description: string;
  amount: number;
  type: 'earning' | 'deduction' | 'tax';
};

// Mock Companies
export const companies: Company[] = [
  { id: 'comp1', name: 'Tech Solutions Ltda' },
  { id: 'comp2', name: 'Comércio Global S.A.' },
  { id: 'comp3', name: 'Consultoria Financeira Ltda' },
];

// Mock Employees
export const employees: Employee[] = [
  { id: 'emp1', name: 'João Silva', position: 'Desenvolvedor Senior', department: 'TI', companyId: 'comp1' },
  { id: 'emp2', name: 'Maria Santos', position: 'Gerente de Projetos', department: 'TI', companyId: 'comp1' },
  { id: 'emp3', name: 'Carlos Oliveira', position: 'Analista Financeiro', department: 'Finanças', companyId: 'comp1' },
  { id: 'emp4', name: 'Ana Costa', position: 'Representante de Vendas', department: 'Vendas', companyId: 'comp2' },
  { id: 'emp5', name: 'Pedro Souza', position: 'Gerente de Marketing', department: 'Marketing', companyId: 'comp2' },
  { id: 'emp6', name: 'Juliana Lima', position: 'Contador', department: 'Contabilidade', companyId: 'comp3' },
];

// Mock Payment Statements
export const paymentStatements: PaymentStatement[] = [
  {
    id: 'pay1',
    employeeId: 'emp1',
    date: '2024-03-30',
    month: '03',
    year: '2024',
    grossAmount: 12000,
    netAmount: 9600,
    currency: 'R$',
    type: 'payslip',
    details: [
      { description: 'Salário Base', amount: 10000, type: 'earning' },
      { description: 'Bônus', amount: 2000, type: 'earning' },
      { description: 'INSS', amount: -1100, type: 'deduction' },
      { description: 'IRRF', amount: -1300, type: 'tax' },
    ],
    status: 'paid',
  },
  {
    id: 'pay2',
    employeeId: 'emp1',
    date: '2024-02-28',
    month: '02',
    year: '2024',
    grossAmount: 10000,
    netAmount: 8300,
    currency: 'R$',
    type: 'payslip',
    details: [
      { description: 'Salário Base', amount: 10000, type: 'earning' },
      { description: 'INSS', amount: -900, type: 'deduction' },
      { description: 'IRRF', amount: -800, type: 'tax' },
    ],
    status: 'paid',
  },
  {
    id: 'pay3',
    employeeId: 'emp2',
    date: '2024-03-30',
    month: '03',
    year: '2024',
    grossAmount: 15000,
    netAmount: 12000,
    currency: 'R$',
    type: 'payslip',
    details: [
      { description: 'Salário Base', amount: 15000, type: 'earning' },
      { description: 'INSS', amount: -1500, type: 'deduction' },
      { description: 'IRRF', amount: -1500, type: 'tax' },
    ],
    status: 'paid',
  },
  {
    id: 'pay4',
    employeeId: 'emp1',
    date: '2024-04-10',
    month: '04',
    year: '2024',
    grossAmount: 3000,
    netAmount: 3000,
    currency: 'R$',
    type: 'bonus',
    details: [
      { description: 'Bônus por Performance', amount: 3000, type: 'earning' },
    ],
    status: 'processing',
  },
  {
    id: 'pay5',
    employeeId: 'emp3',
    date: '2024-03-30',
    month: '03',
    year: '2024',
    grossAmount: 8500,
    netAmount: 7000,
    currency: 'R$',
    type: 'payslip',
    details: [
      { description: 'Salário Base', amount: 8500, type: 'earning' },
      { description: 'INSS', amount: -850, type: 'deduction' },
      { description: 'IRRF', amount: -650, type: 'tax' },
    ],
    status: 'paid',
  },
  {
    id: 'pay6',
    employeeId: 'emp4',
    date: '2024-03-30',
    month: '03',
    year: '2024',
    grossAmount: 7800,
    netAmount: 6500,
    currency: 'R$',
    type: 'payslip',
    details: [
      { description: 'Salário Base', amount: 5800, type: 'earning' },
      { description: 'Comissão', amount: 2000, type: 'earning' },
      { description: 'INSS', amount: -780, type: 'deduction' },
      { description: 'IRRF', amount: -520, type: 'tax' },
    ],
    status: 'paid',
  },
];

// Current user for mock auth
export const currentUser = {
  id: 'admin1',
  name: 'Admin',
  role: 'admin',
  companyIds: ['comp1', 'comp2', 'comp3'], // Has access to all companies
};
