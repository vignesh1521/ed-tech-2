'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context';
import { jwtDecode } from 'jwt-decode';

import './login.css'


export default function LoginPage() {

    const router = useRouter();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const { setUser } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const query = `
        mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
        }
        `;

        const variables = { email: email, password };

        try {
            const response = await fetch('/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, variables }),
            });

            const result = await response.json();

            if (result.errors) {
                setErrorMessage(result.errors[0].message)
                return;
            }

            const token = result.data.login;
            localStorage.   setItem('token', token);
            setUser(jwtDecode(token));
            router.push('/dashboard');
        } catch(err: unknown) {
            if (err instanceof Error) {
                setErrorMessage(err.message || "Something went wrong");
                console.error('Network or GraphQL error:', err);
            } else {
                setErrorMessage("Something went wrong");
                console.error('Unknown error:', err);
            }
        }

    };



    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                {errorMessage && <span className="err_msg">{errorMessage}</span>}
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
