// Test script for the address search functionality

async function testAddressSearch() {
  console.log('Testing Address Search Functionality\n');
  console.log('=====================================\n');

  // Test 1: Address Suggestions
  console.log('1. Testing address suggestions for "268 Byng Ave"...');
  try {
    const suggestResponse = await fetch('http://localhost:3001/api/address-suggest?searchString=268%20Byng%20Ave');
    const suggestData = await suggestResponse.json();
    console.log('Suggestions received:', suggestData.suggestions?.length || 0, 'results');
    if (suggestData.suggestions?.[0]) {
      console.log('First suggestion:', suggestData.suggestions[0].address);
      console.log('KeyString:', suggestData.suggestions[0].keyString);
      
      // Test 2: Geocoding
      console.log('\n2. Testing geocoding for the first suggestion...');
      const keyString = suggestData.suggestions[0].keyString;
      const geocodeResponse = await fetch(`http://localhost:3001/api/geocode?keyString=${encodeURIComponent(keyString)}`);
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.candidates?.[0]?.location) {
        const location = geocodeData.candidates[0].location;
        console.log('Coordinates found:', { x: location.x, y: location.y });
        
        // Test 3: Search daycares by location
        console.log('\n3. Testing daycare search within 5km of location...');
        const daycareResponse = await fetch(
          `http://localhost:3001/api/daycares-by-location?x=${location.x}&y=${location.y}&distance=5000`
        );
        const daycareData = await daycareResponse.json();
        console.log('Daycares found:', daycareData.features?.length || 0);
        
        if (daycareData.features?.length > 0) {
          console.log('\nFirst 3 daycares:');
          daycareData.features.slice(0, 3).forEach((daycare, index) => {
            const props = daycare.properties;
            console.log(`${index + 1}. ${props.NAME} - ${props.ADDRESS}`);
          });
        }
      }
    }
  } catch (error) {
    console.error('Error during testing:', error);
  }
  
  console.log('\n=====================================');
  console.log('Test completed!');
}

// Run the test
testAddressSearch();