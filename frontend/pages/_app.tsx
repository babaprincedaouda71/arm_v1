import Layout from "@/components/Layout";
import "../styles/globals.css";
import type {AppProps} from "next/app";
import {NavigationProvider} from "@/components/NavigationContext";
import {AuthProvider} from "@/contexts/AuthContext";

type CustomAppProps = AppProps & {
    Component: {
        useLayout?: boolean;
    };
};

export default function App({Component, pageProps}: CustomAppProps) {
    const useLayout = Component.useLayout ?? true;

    return (
        <AuthProvider>
            <NavigationProvider>
                {useLayout ? (
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                ) : (
                    <Component {...pageProps} />
                )}
            </NavigationProvider>
        </AuthProvider>
    );
}