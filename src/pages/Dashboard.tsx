
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  ChevronRight, 
  User,
  Users
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import { 
  companies, 
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

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [recentPayslips, setRecentPayslips] = useState<PaymentStatement[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // For admin users, show stats and recent payslips across all companies
    if (isAdmin()) {
      setTotalEmployees(employees.length);
      setTotalCompanies(companies.length);
      setRecentPayslips(
        paymentStatements
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)
      );
    } else {
      // For employee users, only show their own payslips
      setRecentPayslips(
        paymentStatements
          .filter(payslip => payslip.employeeId === user.id)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)
      );
    }
  }, [user, isAdmin, navigate]);

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
    <MobileLayout title="Dashboard">
      <div className="py-6 space-y-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold flex-1">Olá, {user?.name}</h2>
        </div>

        {isAdmin() && (
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-brand-500">
              <CardContent className="p-4 flex items-center">
                <div className="bg-brand-100 dark:bg-brand-900/20 p-2 rounded-full mr-3">
                  <Users className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Funcionários</p>
                  <p className="text-xl font-semibold">{totalEmployees}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-brand-500">
              <CardContent className="p-4 flex items-center">
                <div className="bg-brand-100 dark:bg-brand-900/20 p-2 rounded-full mr-3">
                  <TrendingUp className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Empresas</p>
                  <p className="text-xl font-semibold">{totalCompanies}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-header">Pagamentos Recentes</h3>
            <button 
              onClick={() => navigate('/payslips')}
              className="text-sm text-brand-600 hover:text-brand-700 flex items-center"
            >
              Ver todos <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          {recentPayslips.length > 0 ? (
            <div className="space-y-3">
              {recentPayslips.map((payslip) => (
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
                Nenhum pagamento recente encontrado.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
