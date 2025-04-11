
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from '@/components/MobileLayout';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Calendar,
  Search as SearchIcon
} from 'lucide-react';
import { 
  employees, 
  paymentStatements, 
  type PaymentStatement 
} from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const Search = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PaymentStatement[]>([]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    
    let filteredResults: PaymentStatement[] = [];
    
    if (isAdmin()) {
      // Admin can search across all payslips and employees
      filteredResults = paymentStatements.filter(payslip => {
        const employee = employees.find(emp => emp.id === payslip.employeeId);
        
        return (
          payslip.month.includes(term) ||
          payslip.year.includes(term) ||
          (employee && employee.name.toLowerCase().includes(term)) ||
          payslip.type.toLowerCase().includes(term)
        );
      });
    } else {
      // Employee can only search their own payslips
      filteredResults = paymentStatements.filter(payslip => 
        payslip.employeeId === user?.id && (
          payslip.month.includes(term) ||
          payslip.year.includes(term) ||
          payslip.type.toLowerCase().includes(term)
        )
      );
    }
    
    setSearchResults(filteredResults);
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Funcionário';
  };

  const getPayslipStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'processing':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/20';
      case 'pending':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatPayslipDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM 'de' yyyy", { locale: ptBR });
  };

  const getPayslipTypeLabel = (type: string) => {
    switch (type) {
      case 'payslip':
        return 'Holerite';
      case 'bonus':
        return 'Bônus';
      case 'reimbursement':
        return 'Reembolso';
      default:
        return 'Outro';
    }
  };

  return (
    <MobileLayout title="Buscar">
      <div className="py-6 space-y-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar por mês, ano, tipo..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        
        <div>
          {searchTerm ? (
            <h3 className="section-header">Resultados ({searchResults.length})</h3>
          ) : (
            <div className="text-center py-10">
              <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Busque por holerites</h3>
              <p className="text-muted-foreground mt-2">
                Digite para buscar por mês, ano ou tipo de pagamento
              </p>
            </div>
          )}
          
          {searchTerm && searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((payslip) => (
                <Card 
                  key={payslip.id}
                  className="payslip-card cursor-pointer"
                  onClick={() => navigate(`/payslips/${payslip.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="bg-brand-100 dark:bg-brand-900/20 p-2 rounded-full mr-3">
                          <FileText className="h-5 w-5 text-brand-600" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {getPayslipTypeLabel(payslip.type)}
                          </p>
                          {isAdmin() && (
                            <p className="text-sm text-muted-foreground">
                              {getEmployeeName(payslip.employeeId)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPayslipStatusColor(payslip.status)}`}>
                          {payslip.status === 'paid' ? 'Pago' : 
                           payslip.status === 'processing' ? 'Processando' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">
                          {formatPayslipDate(payslip.date)}
                        </span>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(payslip.netAmount)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : searchTerm ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Nenhum resultado encontrado para "{searchTerm}".
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Search;
