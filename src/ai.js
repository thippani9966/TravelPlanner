// ── AI Service — powered by Groq (free) ─────────────────────────────────────

//var AI_MODEL = 'llama3-8b-8192';
var AI_MODEL = 'llama-3.3-70b-versatile';

function callClaude(systemPrompt, userMessage, maxTokens) {
  maxTokens = maxTokens || 1000;

  return fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.REACT_APP_GROQ_KEY
      
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  })
  .then(function(res) {
    if (!res.ok) {
      return res.json().then(function(err) {
        throw new Error(err.error ? err.error.message : 'API error ' + res.status);
      });
    }
    return res.json();
  })
  .then(function(data) {
    if (data.error) throw new Error(data.error.message || 'AI error');
    var block = data.choices && data.choices[0];
    if (!block) throw new Error('Empty AI response');
    return block.message.content;
  });
}

// 1. Auto-categorise an expense from the user's note
function categoriseExpense(note) {
  var system = 'You are an expense categorisation assistant for a travel app. Given a short expense description, reply with EXACTLY one word from this list: Flight, Hotel, Food, Transport, Activities, Shopping, Other. No punctuation. No explanation. Just the single category word.';
  return callClaude(system, note, 10);
}

// 2. Generate a day-by-day itinerary — returns JSON array
function generateItinerary(destination, days, interests) {
  var system = 'You are an expert travel planner. Return ONLY a valid JSON array with no markdown fences, no preamble, no trailing text. Each element: { "day": number, "title": "short day theme (3-5 words)", "activities": ["activity 1","activity 2","activity 3","activity 4"] }. Make activities specific, vivid, and practical for the destination. Return exactly the number of days requested.';
  var msg = 'Destination: ' + destination + '. Days: ' + days + '. Interests: ' + (interests || 'culture, food, sightseeing') + '.';
  return callClaude(system, msg, 1200).then(function(text) {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  });
}

// 3. Suggest a budget breakdown — returns JSON object
function suggestBudget(destination, days) {
  var system = 'You are a travel budget advisor. Return ONLY valid JSON — no markdown, no preamble. Format: { "total": number, "breakdown": [ { "category": string, "amount": number, "note": string } ], "tip": string }. Categories must be from: Flight, Hotel, Food, Transport, Activities, Shopping. Amounts in USD. The "tip" is one practical money-saving sentence.';
  var msg = 'Destination: ' + destination + '. Duration: ' + days + ' days.';
  return callClaude(system, msg, 400).then(function(text) {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  });
}

// 4. Generate a post-trip narrative summary
function generateTripSummary(trip, spent, budget, catBreakdown) {
  var system = 'You are a friendly travel journalist writing a concise post-trip summary. Write exactly 2-3 sentences. Be warm, specific, and insightful. Mention the destination, key spending patterns, and one actionable tip for next time. No bullet points. Plain prose only.';
  var msg = [
    'Trip: ' + trip.name + ' to ' + trip.destination + '.',
    'Duration: ' + trip.startDate + ' to ' + trip.endDate + '.',
    'Budget: $' + budget + '. Actual spend: $' + spent + '.',
    'Category breakdown: ' + catBreakdown.map(function(c) { return c[0] + ' $' + c[1]; }).join(', ') + '.'
  ].join(' ');
  return callClaude(system, msg, 200);
}

module.exports = { categoriseExpense, generateItinerary, suggestBudget, generateTripSummary };// AI integration
