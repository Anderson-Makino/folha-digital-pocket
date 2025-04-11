
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from '@/components/MobileLayout';
import { 
  Card, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User,
  Building,
  FileText,
  Mail,
  Phone,
  Lock,
  LogOut
} from 'lucide-react';
import { 
  companies,
  employees
} from '@/data/mockData';

const Profile = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    navigate('/');
    return null;
  }

  let userDetails;
  let companyDetails;
  
  if (isAdmin()) {
    userDetails = {
      name: user.name,
      email: "admin@contabilidade.com",
      phone: "+55 (11) 98765-4321",
    };
  } else {
    const employee = employees.find(emp => emp.id === user.id);
    userDetails = employee ? {
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: `${employee.name.toLowerCase().replace(' ', '.')}@email.com`,
      phone: "+55 (11) 97654-3210",
    } : null;
    
    if (employee) {
      companyDetails = companies.find(comp => comp.id === employee.companyId);
    }
  }

  return (
    <MobileLayout title="Perfil">
      <div className="py-6 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="bg-brand-100 dark:bg-brand-800/40 p-4 rounded-full mb-4">
                <User className="h-12 w-12 text-brand-600 dark:text-brand-300" />
              </div>
              <h2 className="text-xl font-semibold mb-1">{userDetails?.name}</h2>
              {!isAdmin() && userDetails?.position && (
                <p className="text-muted-foreground">{userDetails.position}</p>
              )}
              {isAdmin() && (
                <p className="text-muted-foreground">Administrador</p>
              )}
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{userDetails?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-muted-foreground mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p>{userDetails?.phone}</p>
                </div>
              </div>
              
              {!isAdmin() && userDetails?.department && (
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Departamento</p>
                    <p>{userDetails.department}</p>
                  </div>
                </div>
              )}
              
              {!isAdmin() && companyDetails && (
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Empresa</p>
                    <p>{companyDetails.name}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3 px-6 pb-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                navigate('/password');
              }}
            >
              <Lock className="h-4 w-4 mr-2" />
              Alterar Senha
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full text-destructive hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default Profile;
