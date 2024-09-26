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

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        currentSession();
    }, []); // Esse useEffect roda apenas uma vez, quando o componente é montado


    return (
        <Authenticator>
            {({ signOut, user }) => {
                // Atualiza o estado 'currentUser' sempre que o 'user' mudar

                if (user && !isLoggingOut) {
                    setIsLoggingOut(false);
                    console.log("Usuário logado: " + user.username+"  set IsLoggingOut: "+isLoggingOut);
                } else if (isLoggingOut) {
                    console.log("Usuário deslogado");
                }

                const handleSignOut = () => {
                    setIsLoggingOut(true);
                    // Certifica-se de que 'signOut' está definido antes de chamar
                    if (typeof signOut === 'function') {
                        signOut();
                    } else {
                        console.error("signOut não está definido");
                    }
                }

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
