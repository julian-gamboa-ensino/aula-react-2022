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


    useEffect(() => {
        currentSession();
    }, []); // Esse useEffect roda apenas uma vez, quando o componente é montado


    return (
        <Authenticator>
            {({ signOut, user }) => {
                // Atualiza o estado 'currentUser' sempre que o 'user' mudar

                if (user) {
                    console.log("Usuário logado   "+user.username);
                }
                else {
                    console.log("Usuário deslogado ");
                }



                return user ? (
                    <div>
                        <h1>Olá, {user.username}</h1>
                        <button onClick={signOut}>Sair</button>
                    </div>
                ) : (
                    <div>Faça login para continuar</div>
                );
            }}
        </Authenticator>
    );
};

export default CognitoLogin;
