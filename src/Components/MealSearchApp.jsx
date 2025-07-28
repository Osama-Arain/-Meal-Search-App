import React, { useState } from 'react';
import { Search, Clock, MapPin, ChefHat, X } from 'lucide-react';

const MealSearchApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [error, setError] = useState('');

  const searchMeals = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const data = await response.json();

      if (data.meals) {
        setMeals(data.meals);
      } else {
        setMeals([]);
        setError('No meals found. Try a different search term.');
      }
    } catch (err) {
      setError('Failed to fetch meals. Please try again.');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMeals();
    }
  };

  const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
      }
    }
    return ingredients;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 font-inter">
      <div className="container mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="w-12 h-12 text-orange-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Meal Finder</h1>
          </div>
          <p className="text-gray-600 text-lg">Discover delicious recipes from around the world</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for meals (e.g., Pasta, Chicken...)"
              className="w-full px-6 py-4 text-lg border-2 border-orange-300 rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300 placeholder-gray-500"
            />
            <button
              onClick={searchMeals}
              disabled={loading}
              className="absolute right-2 top-2 bg-gradient-to-tr from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white p-3 rounded-full shadow-lg transition-all"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center my-10">
            <div className="w-12 h-12 border-4 border-dashed border-orange-500 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-orange-700 font-medium">Searching for delicious meals...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded shadow flex items-center gap-2">
              <X className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Meals Grid */}
        {meals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meals.map((meal, index) => (
              <div
                key={meal.idMeal}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedMeal(meal)}
              >
                <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">{meal.strMeal}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{meal.strArea}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ChefHat className="w-4 h-4 mr-1" />
                    <span className="text-sm">{meal.strCategory}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Meal Details Modal */}
        {selectedMeal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-orange-100">
              <button
                onClick={() => setSelectedMeal(null)}
                className="absolute top-4 right-4 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-50"
              >
                <X className="w-6 h-6" />
              </button>

              <img
                src={selectedMeal.strMealThumb}
                alt={selectedMeal.strMeal}
                className="w-full h-64 object-cover rounded-t-2xl"
              />

              <div className="p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedMeal.strMeal}</h2>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4 mr-1 text-orange-600" />
                    <span className="text-orange-800">{selectedMeal.strArea}</span>
                  </div>
                  <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                    <ChefHat className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="text-blue-800">{selectedMeal.strCategory}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Ingredients</h3>
                    <ul className="space-y-1">
                      {getIngredients(selectedMeal).map((ingredient, index) => (
                        <li key={index} className="text-gray-600 bg-gray-50 px-3 py-2 rounded">
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Instructions</h3>
                    <div className="text-gray-600 bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto text-sm leading-relaxed">
                      {selectedMeal.strInstructions.split('\n').map((step, index) => (
                        <p key={index} className="mb-2">
                          {step}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedMeal.strYoutube && (
                  <div className="mt-6">
                    <a
                      href={selectedMeal.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      <Clock className="w-5 h-5 mr-2" />
                      Watch Tutorial
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MealSearchApp;
