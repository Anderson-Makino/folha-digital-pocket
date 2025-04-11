
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from '@/components/MobileLayout';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download,
  User,
  Building,
  Calendar,
  ArrowDown,
  ArrowUp,
  Minus
} from 'lucide-react';
import { 
  employees, 
  companies,
  paymentStatements, 
  PaymentStatement, 
  PaymentDetail 
} from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const PayslipDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [payslip, setPayslip] = useState<PaymentStatement | null>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const foundPayslip = paymentStatements.find(p => p.id === id);
    
    // Check if payslip exists and if user has access to it
    if (!foundPayslip || (!isAdmin() && foundPayslip.employeeId !== user.id)) {
      navigate('/payslips');
      return;
    }
    
    setPayslip(foundPayslip);
    
    const foundEmployee = employees.find(e => e.id === foundPayslip.employeeId);
    setEmployee(foundEmployee);
    
    if (foundEmployee) {
      const foundCompany = companies.find(c => c.id === foundEmployee.companyId);
      setCompany(foundCompany);
    }
  }, [id, user, isAdmin, navigate]);

  const formatPayslipDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
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

  const getDetailIcon = (type: string) => {
    switch (type) {
      case 'earning':
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'deduction':
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      case 'tax':
        return <Minus className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getDetailAmountClass = (type: string) => {
    switch (type) {
      case 'earning':
        return 'text-green-600';
      case 'deduction':
      case 'tax':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download iniciado",
      description: "O seu holerite será baixado em PDF.",
    });
  };

  if (!payslip || !employee || !company) {
    return (
      <MobileLayout title="Carregando..." showBackButton>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-pulse-soft text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-brand-400" />
            <p className="text-muted-foreground">Carregando detalhes do holerite...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title={getPayslipTypeLabel(payslip.type)} showBackButton>
      <div className="py-6 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {getPayslipTypeLabel(payslip.type)}
              </CardTitle>
              <span className={`text-xs px-2 py-1 rounded-full font-medium 
                ${payslip.status === 'paid' ? 'text-green-600 bg-green-100' : 
                  payslip.status === 'processing' ? 'text-amber-600 bg-amber-100' : 
                  'text-gray-600 bg-gray-100'}`}>
                {payslip.status === 'paid' ? 'Pago' : 
                 payslip.status === 'processing' ? 'Processando' : 'Pendente'}
              </span>
            </div>
            <CardDescription>
              Referente a {formatPayslipDate(payslip.date)}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                  <User className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Funcionário</p>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">{employee.position}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                  <Building className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Empresa</p>
                  <p className="font-medium">{company.name}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Detalhes do Pagamento</h3>
                <div className="space-y-3">
                  {payslip.details.map((detail: PaymentDetail, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2">{getDetailIcon(detail.type)}</span>
                        <span>{detail.description}</span>
                      </div>
                      <span className={getDetailAmountClass(detail.type)}>
                        {detail.type !== 'earning' ? '-' : ''}
                        {formatCurrency(Math.abs(detail.amount))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Bruto</p>
                  <p className="font-medium">{formatCurrency(payslip.grossAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Valor Líquido</p>
                  <p className="font-semibold text-lg text-brand-700">{formatCurrency(payslip.netAmount)}</p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full"
              variant="outline"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default PayslipDetail;
