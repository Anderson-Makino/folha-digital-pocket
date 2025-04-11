
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from '@/components/MobileLayout';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FileText, 
  Calendar,
  Filter,
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

const Payslips = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [payslips, setPayslips] = useState<PaymentStatement[]>([]);
  const [filteredPayslips, setFilteredPayslips] = useState<PaymentStatement[]>([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (isAdmin()) {
      setPayslips(paymentStatements);
    } else {
      setPayslips(paymentStatements.filter(payslip => payslip.employeeId === user.id));
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    let filtered = [...payslips];
    
    if (selectedYear !== 'all') {
      filtered = filtered.filter(payslip => payslip.year === selectedYear);
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(payslip => payslip.type === selectedType);
    }
    
    if (selectedEmployee !== 'all') {
      filtered = filtered.filter(payslip => payslip.employeeId === selectedEmployee);
    }
    
    setFilteredPayslips(
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }, [payslips, selectedYear, selectedType, selectedEmployee]);

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

  // Get unique years from payslips
  const years = Array.from(new Set(payslips.map(p => p.year))).sort().reverse();
  
  return (
    <MobileLayout title="Holerites" showBackButton>
      <div className="py-6 space-y-6">
        <div className="flex flex-col space-y-4">
          <h3 className="section-header mb-2">Filtros</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Anos</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="payslip">Holerite</SelectItem>
                  <SelectItem value="bonus">Bônus</SelectItem>
                  <SelectItem value="reimbursement">Reembolso</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isAdmin() && (
            <div>
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Funcionário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Funcionários</SelectItem>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="section-header">Resultados ({filteredPayslips.length})</h3>
          
          {filteredPayslips.length > 0 ? (
            <div className="space-y-3">
              {filteredPayslips.map((payslip) => (
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
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Nenhum holerite encontrado com os filtros selecionados.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Payslips;
