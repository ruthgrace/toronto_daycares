import { DaycareFeature } from '@/lib/types/daycare';

interface DaycareCardProps {
  daycare: DaycareFeature;
}

export default function DaycareCard({ daycare }: DaycareCardProps) {
  const { properties } = daycare;
  
  const getSpaceInfo = () => {
    const spaces = [];
    if (properties.IGSPACE > 0) spaces.push('Infant');
    if (properties.TGSPACE > 0) spaces.push('Toddler');
    if (properties.PGSPACE > 0) spaces.push('Preschool');
    if (properties.KGSPACE > 0) spaces.push('Kindergarten');
    if (properties.SGSPACE > 0) spaces.push('School Age');
    return spaces;
  };

  const availableSpaces = getSpaceInfo();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-orange-100 hover:shadow-md transition-shadow p-5">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 pr-2">
          {properties.NAME}
        </h3>
        {properties.CWELCC_FLAG === 'Y' && (
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">
            CWELCC ✓
          </span>
        )}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-start">
          <svg className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-600">{properties.ADDRESS}</span>
        </div>
        
        <div className="flex items-center">
          <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <a href={`tel:${properties.PHONE}`} className="text-blue-600 hover:underline">
            {properties.PHONE}
          </a>
        </div>

        {availableSpaces.length > 0 && (
          <div className="flex items-start">
            <svg className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <div className="flex flex-wrap gap-1">
              {availableSpaces.map((space) => (
                <span key={space} className="bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded">
                  {space}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-2">
          Ward {properties.WARD} • {properties.TYPE === 1 ? 'Subsidy Available' : 'No Subsidy'}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <a
          href={properties.LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-2 rounded-md transition-colors"
        >
          View Details
        </a>
        <button className="px-3 py-2 border border-orange-300 text-orange-600 hover:bg-orange-50 rounded-md text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}