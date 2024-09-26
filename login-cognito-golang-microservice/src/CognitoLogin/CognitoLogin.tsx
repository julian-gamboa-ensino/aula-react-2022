import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import awsconfig from '../../aws-exports';

import { fetchAuthSession } from 'aws-amplify/auth';

Amplify.configure(awsconfig);

async function currentSession() {
  try {
    const { tokens } = await fetchAuthSession({ forceRefresh: true });

    if (tokens!) {
      console.log(tokens?.accessToken.toString());
    } else {
      console.log("TOKEN is NULL");
    }
  } catch (err) {
    console.log(err);
  }
}

const CognitoLogin = () => {
  const [currentUser, setCurrentUser] = useState(""); 
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    console.log("useEffect CurrentUser: " + currentUser + " isLoggingOut: " + isLoggingOut);
  }, [currentUser, isLoggingOut]); // Certifique-se de incluir 'isLoggingOut' aqui

  return (
    <Authenticator>
      {({ signOut, user }) => {
        if (user) {
          setCurrentUser(user.username); 
          //console.log("Usuário logado: " + user.username + " set IsLoggingOut: " + isLoggingOut + " CurrentUser: " + currentUser);
        }

        const handleSignOut = () => {
          setIsLoggingOut(true);
          setCurrentUser(""); 
          if (typeof signOut === 'function') {
            signOut();
          } else {
            console.error("signOut não está definido");
          }
        };

        return user ? (
          <div>
            <h1>Olá, {user.username}</h1>
            <button onClick={handleSignOut}>Sair</button>
          </div>
        ) : (
          <div>Faça login para continuar</div>
        );
      }}
    </Authenticator>
  );
};

export default CognitoLogin;