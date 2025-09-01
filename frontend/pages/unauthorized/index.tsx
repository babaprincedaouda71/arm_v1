// pages/unauthorized.tsx

import Link from 'next/link';
import Head from 'next/head';

const UnauthorizedPage = () => {
    return (
        <>
            <Head>
                <title>Accès non autorisé | MonApp</title>
                <meta name="robots" content="noindex"/>
            </Head>
            <main
                className="flex flex-col items-center justify-center min-h-screen px-4 text-center"
                role="alert"
                aria-label="Accès refusé"
            >
                <h1 className="text-4xl font-bold text-red-600">403 - Accès refusé</h1>
                <p className="mt-4 text-gray-700">
                    Vous n’avez pas les autorisations nécessaires pour accéder à cette page.
                </p>
                <Link href="/" passHref legacyBehavior>
                    <a className="mt-6 text-blue-600 hover:underline focus:outline-none focus:ring focus:ring-blue-300 rounded">
                        Retour à l’accueil
                    </a>
                </Link>
            </main>
        </>
    );
};

export default UnauthorizedPage;

// Optionnel : si tu utilises un système de layout global
UnauthorizedPage.useLayout = false;