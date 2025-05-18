import { useState } from "react";
import { useAuth } from "../context/auth";
import BookExchange from "./BookExchange";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function BookCard({ book, onUpdate }) {
  const [showDescription, setShowDescription] = useState(false);
  const { user } = useAuth();

  const canRequestExchange = user &&
    user.id !== book.owner_id &&
    book.status === "available";

  const statusColors = {
    available: "bg-green-100 text-green-800",
    exchanged: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="card">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
            <p className="text-sm text-gray-500">{book.author}</p>
          </div>
          <span className={clsx(
            "px-2 py-1 text-xs font-medium rounded-full",
            statusColors[book.status]
          )}>
            {book.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Genre</p>
            <p className="font-medium">{book.genre}</p>
          </div>
          <div>
            <p className="text-gray-500">Language</p>
            <p className="font-medium">{book.language}</p>
          </div>
          <div>
            <p className="text-gray-500">Condition</p>
            <p className="font-medium">{book.condition}</p>
          </div>
          <div>
            <p className="text-gray-500">Pages</p>
            <p className="font-medium">{book.pages}</p>
          </div>
          <div>
            <p className="text-gray-500">Exchange Type</p>
            <p className="font-medium">{book.exchange_type}</p>
          </div>
          <div>
            <p className="text-gray-500">Owner</p>
            <p className="font-medium">{book.owner?.full_name || 'Unknown'}</p>
          </div>
        </div>

        {book.description && (
          <div className="space-y-2">
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              {showDescription ? (
                <ChevronUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 mr-1" />
              )}
              {showDescription ? "Hide Description" : "Show Description"}
            </button>
            {showDescription && (
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {book.description}
              </p>
            )}
          </div>
        )}

        {canRequestExchange && (
          <div className="pt-4 border-t border-gray-200">
            <BookExchange bookId={book.id} onSuccess={onUpdate} />
          </div>
        )}
      </div>
    </div>
  );
}