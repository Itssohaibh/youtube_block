/**
 * Shadowrocket YouTube Response Rewrite Script
 * Intercepts YouTube API/player responses to remove ad slots and sponsor payloads.
 */
function handleResponse(response) {
    let body = response.body;
    
    if (!body) {
        return { body: body };
    }

    try {
        let obj = JSON.parse(body);
        
        const removeAds = (node) => {
            if (node && typeof node === 'object' && node !== null) {
                for (let key in node) {
                    if (!Object.prototype.hasOwnProperty.call(node, key)) continue;
                    
                    let val = node[key];
                    
                    // Target and neutralize YouTube ad placement structures
                    if (/adPlacements|playerAds|adSlots|promotedSparkles|masthead|engagementPanels/i.test(key)) {
                        if (Array.isArray(val)) {
                            node[key] = [];
                        } else if (typeof val === 'object') {
                            node[key] = {};
                        } else {
                            node[key] = null;
                        }
                    }
                    
                    if (val && typeof val === 'object') {
                        removeAds(val);
                    }
                }
            }
        };
        
        removeAds(obj);
        body = JSON.stringify(obj);
    } catch (e) {
        // Fallback for non-JSON content streams
    }

    return { body: body };
}

$done(handleResponse($response));