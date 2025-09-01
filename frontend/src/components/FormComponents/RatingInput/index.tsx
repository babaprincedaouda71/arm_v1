// src/components/FormComponents/RatingInput.tsx
import React, {useEffect, useState} from "react"; // Import useEffect

interface RatingInputProps {
    questionId: string;
    initialRating?: number;
    onRatingChange?: (questionId: string, name: string, value: number) => void;
    readOnly?: boolean;

}

const RatingInput: React.FC<RatingInputProps> = ({questionId, initialRating = 0, onRatingChange, readOnly = false}) => {
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0); // State to manage hover rating

    // Use useEffect to update internal state if initialRating prop changes
    // This is important if the parent component resets or changes the initialRating
    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);


    const handleStarClick = (clickedRating: number) => {
        if (readOnly) return;
        // Si l'utilisateur clique sur l'étoile qui est déjà sélectionnée,
        // on réinitialise la note à 0. Sinon, on met la note à la valeur cliquée.
        const newRating = rating === clickedRating ? 0 : clickedRating;
        setRating(newRating);
        // Appeler la fonction de rappel pour informer le parent
        if (onRatingChange) {
            onRatingChange(questionId, 'ratingValue', newRating);
        }
    };

    const handleStarHover = (hoveredRating: number) => {
        if (readOnly) return;
        setHoverRating(hoveredRating);
    };

    const handleMouseLeave = () => {
        if (readOnly) return;
        setHoverRating(0); // Reset hover rating when mouse leaves
    };

    // Determine the display rating based on hover state
    const displayRating = hoverRating || rating;


    return (
        <div>
            {/*<label className="block text-sm font-medium text-gray-700">Votre évaluation:</label>*/}
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        // Use displayRating to determine the color
                        className={`w-12 h-12 ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${star <= displayRating ? 'text-yellow-500' : 'text-gray-300'}`} // <-- Modifiez cette ligne
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
                        onMouseLeave={handleMouseLeave}
                        // Use displayRating for fill/stroke logic as well
                        fill={star <= displayRating ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 2.138l-3.006 6.092L2.297 8.855l4.834 4.708L5.82 18.802 12 15.777l6.18 3.025-1.301-5.239 4.834-4.708-5.703-.625L12 2.138z"
                        />
                    </svg>
                ))}
            </div>
        </div>
    );
};

export default RatingInput;