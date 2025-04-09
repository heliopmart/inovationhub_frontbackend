import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import style from '@/styles/components/Loading.module.scss'

import {authUser} from "@/types/interfaceClass"

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return function AuthenticatedComponent(props: P) {
    const [user, setUser] = useState<authUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch('/api/auth/me');
          if (!response.ok) throw new Error('Usuário não autenticado');
          const data = await response.json();
          setUser(data);
        } catch {
          router.push('/login');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, []);

    if (loading) {
      return ( 
        <div className={style.containerLoading}>
          <span>Authenticando Usuário</span>
        </div>
      );
    }

    if (!user) {
      return (
        <div className={style.containerLoading}>
          <span>Usuário não autenticado</span>
        </div>
      );
    }

    // Passa as props do componente original
    return <WrappedComponent {...props} authUser={user} />;
  };
};

export default withAuth;
