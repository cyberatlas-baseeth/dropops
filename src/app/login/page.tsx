'use client';

import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <AuthForm mode="login" />
        </div>
    );
}
