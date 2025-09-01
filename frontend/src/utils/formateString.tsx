import React from 'react';

/**
 * Convertit une chaîne séparée par des virgules en éléments TSX avec sauts de ligne.
 * @param {string} input - La chaîne à formater (ex: "Paris, Bordeaux, Marseille").
 * @param {string} separator - Le séparateur (par défaut: ',').
 * @param {React.ReactNode} lineBreak - Élément de saut de ligne (par défaut: <br />).
 * @returns {React.ReactNode} - Éléments JSX formatés.
 */
export const formatCommaSeparatedToLines = (
    input: string,
    separator: string = ',',
    lineBreak: React.ReactNode = <br/>
): React.ReactNode => {
    if (!input) return null;

    return (
        <>
            {input
                .split(separator)
                .map((item, index, array) => (
                    <React.Fragment key={index}>
                        {item.trim()}
                        {index < array.length - 1 && lineBreak}
                    </React.Fragment>
                ))}
        </>
    );
};

/**
 * Version alternative avec conteneur `<div>` et style Tailwind.
 * @param {string} input - La chaîne à formater.
 * @param {string} separator - Le séparateur (par défaut: ',').
 * @returns {React.ReactNode} - Éléments JSX dans un conteneur flex-col.
 */
export const formatCommaSeparatedToColumn = (
    input: string,
    separator: string = ','
): React.ReactNode => {
    if (!input) return null;

    return (
        <div className="flex flex-col gap-1">
            {input.split(separator).map((item, index) => (
                <span key={index}>{item.trim()}</span>
            ))}
        </div>
    );
};