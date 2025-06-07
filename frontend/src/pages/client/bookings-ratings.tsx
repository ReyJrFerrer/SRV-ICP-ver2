import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';

interface RatingProps {
  providerName: string;
  onSubmit: (rating: number, feedback: string) => void;
}

export default function BookingRating({ providerName, onSubmit }: RatingProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const router = useRouter();

  const handleRating = (value: number) => setRating(value);

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-white rounded-lg shadow">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-sm text-blue-600 hover:underline"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
      </button>

      <h2 className="text-xl font-semibold mb-2">Rate {providerName}</h2>
      <p className="text-gray-500 mb-4">How satisfied were you with the service?</p>

      {/* Star Rating */}
      <div className="flex space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-7 w-7 cursor-pointer transition-colors ${
              (hovered ?? rating) >= star ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            fill={(hovered ?? rating) >= star ? 'currentColor' : 'none'}
          />
        ))}
      </div>

      {/* Feedback Textarea */}
      <textarea
        placeholder="Write your feedback..."
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      {/* Submit Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onSubmit(rating, feedback)}
          disabled={rating === 0}
          className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
}
