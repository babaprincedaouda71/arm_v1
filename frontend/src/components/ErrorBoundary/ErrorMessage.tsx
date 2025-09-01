interface ErrorMessageProps {
    error: Error;
    resetError?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, resetError }) => (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Une erreur est survenue</h3>
        <p className="text-red-600 mt-2">{error.message}</p>
        {resetError && (
            <button
                onClick={resetError}
                className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
            >
                Réessayer
            </button>
        )}
    </div>
);

export default ErrorMessage;