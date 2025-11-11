import React from 'react'

 function SmallCard({ children }: { children: React.ReactNode }) {
      return <div className="bg-white/60 border border-gray-100 rounded-lg p-4">{children}</div>;
    }

export default SmallCard