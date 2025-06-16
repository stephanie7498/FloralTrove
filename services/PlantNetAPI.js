// =============================================================================
// services/PlantNetAPI.js - Plant identificatie service
// =============================================================================
// Deze service beheert de integratie met PlantNet API voor AI plant herkenning.
// Bevat privacy consent, API calls, en mapping van resultaten naar app planten.

import { Alert } from 'react-native';

// PlantNet API configuratie
const PLANTNET_API_KEY = '2b103cFgNLqBWUbz2wBVn7Ddoe';
const PLANTNET_API_URL = 'https://my-api.plantnet.org/v2/identify/all';

// Export de PlantNetAPI als een object met alle methods
const PlantNetAPI = {
    apiKey: PLANTNET_API_KEY,
    baseUrl: PLANTNET_API_URL,

    // =============================================================================
    // PRIVACY EN CONSENT MANAGEMENT
    // =============================================================================

    /**
     * Vraag gebruiker toestemming voor data verzending naar PlantNet
     * GDPR compliance - gebruiker moet expliciet toestemmen
     */
    async requestPermission() {
        return new Promise((resolve) => {
            Alert.alert(
                "🌸 Plant Identification",
                "We'll send your photo to PlantNet (a scientific plant identification service) to identify the flower. This helps improve plant research!\n\n• Your photo will be processed securely\n• PlantNet is based in France (GDPR compliant)\n• Data is used for scientific research\n• No personal data is shared",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => resolve(false)
                    },
                    {
                        text: "Identify Plant",
                        style: "default",
                        onPress: () => resolve(true)
                    }
                ]
            );
        });
    },

    // =============================================================================
    // PLANT IDENTIFICATIE
    // =============================================================================

    /**
     * Hoofdfunctie: identificeer plant van foto via PlantNet API
     * @param {string} imageUri - URI van de foto om te identificeren
     * @param {Array} organs - Plant organen zichtbaar in foto (default: flower)
     * @returns {Object} - Identificatie resultaat met succes/faal status
     */
    async identifyPlant(imageUri, organs = ['flower']) {
        try {
            console.log('🔍 Starting PlantNet identification...');
            console.log('📍 API URL:', `${this.baseUrl}?api-key=${this.apiKey}`);
            console.log('📸 Image URI:', imageUri);

            // Maak FormData voor multipart upload
            const formData = new FormData();

            // Voeg afbeelding toe aan form data
            formData.append('images', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'plant_photo.jpg'
            });

            // PlantNet v2 API vereist: 1 orgaan per afbeelding
            const selectedOrgan = organs[0] || 'flower';
            formData.append('organs', selectedOrgan);

            console.log('🔍 Using organ type:', selectedOrgan);
            console.log('📤 Sending request to PlantNet (v2 API)...');

            // Verstuur API request
            const response = await fetch(`${this.baseUrl}?api-key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    // Geen Content-Type header - laat fetch het automatisch instellen voor FormData
                },
                body: formData,
            });

            console.log('📡 PlantNet response status:', response.status);

            // Handle API fouten
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ PlantNet API error:', response.status, errorText);

                // Specifieke foutafhandeling
                if (response.status === 404) {
                    throw new Error('PlantNet API endpoint not found. Please check API configuration.');
                } else if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your PlantNet API key.');
                } else if (response.status === 429) {
                    throw new Error('Too many requests. Please try again later.');
                } else if (response.status === 400) {
                    throw new Error('Bad request format. Please try again with a different image.');
                } else {
                    throw new Error(`PlantNet API error: ${response.status} - ${errorText}`);
                }
            }

            const data = await response.json();
            console.log('✅ PlantNet identification SUCCESS!');
            console.log('📊 Results found:', data.results?.length || 0, 'species');

            // Log top 3 resultaten voor debugging
            if (data.results && data.results.length > 0) {
                console.log('🎯 Top 3 results:');
                data.results.slice(0, 3).forEach((result, index) => {
                    const confidence = (result.score * 100).toFixed(1);
                    const scientificName = result.species.scientificNameWithoutAuthor;
                    console.log(`  ${index + 1}. ${scientificName} (${confidence}%)`);
                });
            }

            return this.processResults(data);

        } catch (error) {
            console.error('❌ Error identifying plant:', error);

            // Gebruiksvriendelijke foutmeldingen
            if (error.message.includes('network') || error.message.includes('Network')) {
                throw new Error('Network connection error. Please check your internet connection.');
            } else if (error.message.includes('404')) {
                throw new Error('Plant identification service is currently unavailable.');
            } else if (error.message.includes('401')) {
                throw new Error('Authentication error. Please try again later.');
            } else if (error.message.includes('400')) {
                throw new Error('Invalid image format. Please try a different photo.');
            } else {
                throw error;
            }
        }
    },

    // =============================================================================
    // RESULTAAT VERWERKING
    // =============================================================================

    /**
     * Verwerk PlantNet API resultaten en map naar onze app planten
     * @param {Object} apiResponse - Raw API response van PlantNet
     * @returns {Object} - Gestandaardiseerd resultaat object
     */
    processResults(apiResponse) {
        try {
            if (!apiResponse.results || apiResponse.results.length === 0) {
                return {
                    success: false,
                    message: 'No plants identified in this image',
                    confidence: 0,
                    plantId: null
                };
            }

            // Neem het beste resultaat (hoogste confidence)
            const bestMatch = apiResponse.results[0];
            const confidence = bestMatch.score * 100; // Zet om naar percentage

            console.log('🏆 BEST MATCH:', bestMatch.species.scientificNameWithoutAuthor);
            console.log('📈 Confidence:', confidence.toFixed(1) + '%');

            // Map PlantNet resultaat naar onze app planten
            const mappedPlant = this.mapToAppPlant(bestMatch, confidence);

            if (mappedPlant) {
                console.log('✅ SUCCESSFUL MAPPING to app plant:', mappedPlant.plantId);
                return {
                    success: true,
                    plantId: mappedPlant.plantId,
                    confidence: confidence,
                    scientificName: bestMatch.species.scientificNameWithoutAuthor,
                    commonNames: bestMatch.species.commonNames || [],
                    message: `Found ${mappedPlant.commonName} with ${confidence.toFixed(1)}% confidence`
                };
            } else {
                console.log('❌ No mapping found - plant not in our collection');
                return {
                    success: false,
                    message: 'This plant is not in our collection yet',
                    confidence: confidence,
                    scientificName: bestMatch.species.scientificNameWithoutAuthor,
                    plantId: null
                };
            }

        } catch (error) {
            console.error('❌ Error processing PlantNet results:', error);
            return {
                success: false,
                message: 'Error processing identification results',
                confidence: 0,
                plantId: null
            };
        }
    },

    // =============================================================================
    // PLANT MAPPING LOGICA
    // =============================================================================

    /**
     * Map PlantNet wetenschappelijke namen naar onze app plant IDs
     * Deze functie bepaalt welke PlantNet resultaten overeenkomen met onze 4 ondersteunde bloemen
     * @param {Object} plantNetResult - PlantNet species resultaat
     * @param {number} confidence - Confidence percentage
     * @returns {Object|null} - Gemapte plant of null als geen match
     */
    mapToAppPlant(plantNetResult, confidence) {
        const scientificName = plantNetResult.species.scientificNameWithoutAuthor.toLowerCase();
        const commonNames = (plantNetResult.species.commonNames || [])
            .map(name => name.toLowerCase());

        console.log('🔍 Mapping scientific name:', scientificName);
        console.log('🔍 Common names:', commonNames);

        // Minimum confidence threshold (10% voor testing, verhoog in productie)
        if (confidence < 10) {
            console.log('⚠️ Confidence too low:', confidence + '%');
            return null;
        }

        // Mapping rules voor ondersteunde bloemen in onze app
        const plantMappings = [
            // Cornflower (Korenbloem)
            {
                scientificNames: ['centaurea cyanus'],
                commonNames: ['cornflower', 'bachelor button', 'blue bottle', 'boutonniere flower'],
                plantId: 'cornflower',
                commonName: 'Cornflower'
            },
            // Daisy (Madeliefje)
            {
                scientificNames: ['bellis perennis', 'leucanthemum vulgare', 'chrysanthemum leucanthemum'],
                commonNames: ['common daisy', 'english daisy', 'lawn daisy', 'white daisy', 'oxeye daisy'],
                plantId: 'daisy',
                commonName: 'Daisy'
            },
            // Poppy (Klaproos)
            {
                scientificNames: ['papaver rhoeas', 'papaver dubium', 'papaver somniferum'],
                commonNames: ['corn poppy', 'field poppy', 'red poppy', 'common poppy', 'flanders poppy'],
                plantId: 'poppy',
                commonName: 'Poppy'
            },
            // Yellow Daisy (Gele Ganzenbloem)
            {
                scientificNames: ['leucanthemum vulgare', 'rudbeckia hirta', 'helianthus annuus', 'chrysanthemum segetum'],
                commonNames: ['yellow daisy', 'corn marigold', 'black-eyed susan', 'golden daisy', 'yellow chamomile'],
                plantId: 'gele_ganzenbloem',
                commonName: 'Yellow Daisy'
            }
        ];

        // Check elke mapping voor matches
        for (const mapping of plantMappings) {
            // Controleer wetenschappelijke naam match
            const scientificMatch = mapping.scientificNames.some(name =>
                scientificName.includes(name) || name.includes(scientificName)
            );

            // Controleer common name match
            const commonMatch = commonNames.some(userCommon =>
                mapping.commonNames.some(mappingCommon =>
                    userCommon.includes(mappingCommon) || mappingCommon.includes(userCommon)
                )
            );

            if (scientificMatch || commonMatch) {
                console.log('✅ MATCHED to app plant:', mapping.plantId, '(' + mapping.commonName + ')');
                return mapping;
            }
        }

        console.log('❌ No mapping found for:', scientificName);
        return null;
    },

    // =============================================================================
    // SERVICE INFORMATIE
    // =============================================================================

    /**
     * Haal informatie op over PlantNet service voor gebruiker
     * @returns {Object} - Service informatie object
     */
    getServiceInfo() {
        return {
            name: 'PlantNet',
            description: 'PlantNet is a citizen science project that helps identify plants through photos. It\'s developed by French research institutions and helps advance botanical research.',
            website: 'https://plantnet.org',
            privacy: 'GDPR compliant, based in France, data used for scientific research',
            accuracy: 'Very high for common European plants and flowers'
        };
    }
};

// Export het object direct
export default PlantNetAPI;