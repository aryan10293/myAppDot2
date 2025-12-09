import React, { useState } from 'react';

interface ReflectionData {
  id: string;
  date: string;
  text: string;
}

function Reflection({ goalName }: { goalName: string }) {
  const [reflection, setReflection] = useState<string>('');
  console.log(goalName)
    const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();
    // Here you would typically send the reflection to your backend server
    const response = await fetch(`http://localhost:2050/history/${goalName}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ text: reflection }),
    });
    
    const data = await response.json(); 
    console.log(data)
    setReflection('');
  }




  return (
    <div className="space-y-6">
      {/* Write reflection section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reflect on today</h2>
        <p className="text-sm text-gray-600 mb-4">
          Take a moment to think about how your day went. What went well? What could you improve?
        </p>

        <form className="space-y-4">
          <div>
            <label htmlFor="reflection-text" className="block text-xs font-medium text-gray-700 mb-2">
              Your reflection
            </label>
            <textarea
              id="reflection-text"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Write about your experience today... What went well? What was challenging? How did you feel?"
              rows={5}
              maxLength={200}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
            <div className="mt-2 text-xs text-gray-500">
              {reflection.length} / 200 characters
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
                onClick={(handleSubmit)}
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 text-sm transition"
            >
              Save reflection
            </button>
            <button
                onClick={() => {setReflection("")}}
              type="reset"
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 text-sm transition"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Reflection;
