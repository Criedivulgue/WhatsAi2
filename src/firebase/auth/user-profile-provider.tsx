'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useAuthState, useFirestore, useDoc, useAuth } from '@/firebase';
import { userConverter, brandConverter } from '@/firebase/converters';
import type { User, Brand } from '@/lib/types';
import { type User as FirebaseUser } from 'firebase/auth';

export interface ComposedUserProfile extends User, Brand {
  email: string | null;
  uid: string;
}

interface UserProfileContextType {
  user: ComposedUserProfile | null;
  auth: FirebaseUser | null;
  loading: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const auth = useAuth();

  // Etapa 1: Obter usuário de autenticação.
  const { user: authUser, loading: authLoading } = useAuthState(auth);

  // Etapa 2: Buscar o documento do usuário.
  const userDocRef = authUser ? doc(firestore, 'users', authUser.uid).withConverter(userConverter) : null;
  const [userDoc, userLoading] = useDoc(userDocRef);
  const userData = userDoc?.data();

  // Etapa 3: Lógica de compatibilidade para dados da marca.
  // Verifica se o modelo de dados novo (com brandId) está em uso.
  const hasBrandId = !!userData?.brandId;
  const brandDocRef = hasBrandId ? doc(firestore, 'brands', userData.brandId).withConverter(brandConverter) : null;
  const [brandDoc, brandLoading] = useDoc(brandDocRef);
  const brandDataFromDoc = brandDoc?.data();

  // O carregamento geral agora considera o caminho condicional da busca da marca.
  const loading = authLoading || userLoading || (hasBrandId && brandLoading);

  // Etapa 4: Compor o perfil final, lidando com AMBOS os modelos de dados (antigo e novo).
  const composedUser: ComposedUserProfile | null = useMemo(() => {
    if (!authUser || !userData) {
      return null; // Condição base: sem autenticação ou dados do usuário, não há perfil.
    }

    // CASO 1: Modelo de dados NOVO (user -> brandId -> brands collection)
    if (hasBrandId) {
      if (!brandDataFromDoc) {
        // Se esperamos dados da marca da coleção separada, mas eles ainda não chegaram, o perfil não está pronto.
        return null;
      }
      // Combina dados do usuário e dados da marca de coleções separadas.
      return {
        ...userData,
        ...brandDataFromDoc,
        uid: authUser.uid,
        email: authUser.email,
      };
    } else {
      // CASO 2: Modelo de dados ANTIGO (todos os dados da marca no próprio documento do usuário)
      // Este é o fallback que conserta a sua conta. Ele assume que os campos da marca estão em userData.
      return {
        ...(userData as any), // Trata userData como se tivesse todos os campos necessários.
        uid: authUser.uid,
        email: authUser.email,
      };
    }
  }, [authUser, userData, hasBrandId, brandDataFromDoc]);

  const value = {
    user: composedUser,
    auth: authUser ?? null,
    loading,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile deve ser usado dentro de um UserProfileProvider');
  }
  return context;
}
