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
        console.log(tokens?.accessToken.toString());
    } catch (err) {
        console.log(err);
    }
}


const CognitoLogin = () => {

    const [apiData, setApiData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await fetch('http://localhost:3000/bootcamps');
                const data = await response.json();
                setApiData(data);
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
            }

        };

        fetchData();
        currentSession();
    }, []);

    return (
        <Authenticator>
            {({ signOut, user }) => {

                return user ? (
                    <div>
                        <h1>Olá, {user.username}</h1>
                        {apiData && <pre>{JSON.stringify(apiData, null, 2)}</pre>}
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
