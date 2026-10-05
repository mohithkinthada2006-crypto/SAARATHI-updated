import { JourneyMode, NaturalLanguageConstraint, VehicleType } from '../types';

export function parseNaturalLanguageQuery(query: string): NaturalLanguageConstraint {
  const lower = query.toLowerCase();
  
  // 1. Detect Vehicle
  let detectedVehicle: VehicleType | undefined = undefined;
  if (lower.includes('bike') || lower.includes('motorcycle') || lower.includes('scooter') || lower.includes('two wheeler') || lower.includes('2-wheeler')) {
    detectedVehicle = 'bike';
  } else if (lower.includes('ev') || lower.includes('electric') || lower.includes('nexon') || lower.includes('tata ev') || lower.includes('ola') || lower.includes('ather')) {
    detectedVehicle = 'ev';
  } else if (lower.includes('auto') || lower.includes('rickshaw') || lower.includes('tuk tuk')) {
    detectedVehicle = 'auto';
  } else if (lower.includes('cycle') || lower.includes('bicycle') || lower.includes('pedal')) {
    detectedVehicle = 'bicycle';
  } else if (lower.includes('car') || lower.includes('sedan') || lower.includes('suv') || lower.includes('cab') || lower.includes('taxi')) {
    detectedVehicle = 'car';
  }

  // 2. Detect Budget
  let maxBudget: number | undefined = undefined;
  const budgetMatch = lower.match(/(?:under|less than|within|spend more than|below|budget of|max(?:imum)?)\s*(?:rs\.?|₹|inr)?\s*(\d+)/i) 
    || lower.match(/(\d+)\s*(?:rs|₹|rupees)/i);
  if (budgetMatch && budgetMatch[1]) {
    maxBudget = parseInt(budgetMatch[1], 10);
  }

  // 3. Detect Arrival Deadline
  let arrivalDeadline: string | undefined = undefined;
  const timeMatch = lower.match(/(?:by|before|reach at|around)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))/i);
  if (timeMatch && timeMatch[1]) {
    arrivalDeadline = timeMatch[1].toUpperCase().replace(/\./g, '');
  }

  // 4. Detect Priority / Journey Mode
  let priority: JourneyMode = 'balanced';
  if (lower.includes('avoid toll') || lower.includes('no toll') || lower.includes('cheapest') || lower.includes('economical') || lower.includes('save money') || lower.includes('budget')) {
    priority = 'cheapest';
  } else if (lower.includes('fastest') || lower.includes('quickest') || lower.includes('saves time') || lower.includes('in a hurry') || lower.includes('urgent') || lower.includes('rush')) {
    priority = 'fastest';
  } else if (lower.includes('smoothest') || lower.includes('no pothole') || lower.includes('avoid pothole') || lower.includes('good road') || lower.includes('clean road')) {
    priority = 'smoothest';
  } else if (lower.includes('safest') || lower.includes('safe') || lower.includes('avoid waterlogging') || lower.includes('night') || lower.includes('monsoon')) {
    priority = 'safest';
  }

  // 5. Detect Toll avoidance
  const avoidTolls = lower.includes('avoid toll') || lower.includes('no toll') || lower.includes('toll free') || lower.includes('without toll');

  // 6. Detect Waterlogging avoidance
  const avoidWaterlogging = lower.includes('waterlogging') || lower.includes('flood') || lower.includes('rain') || lower.includes('monsoon');

  // 7. Detect battery percent
  let batteryPercent: number | undefined = undefined;
  const batteryMatch = lower.match(/(\d{1,2})%\s*battery/i) || lower.match(/battery\s*(?:is|at)?\s*(\d{1,2})%/i);
  if (batteryMatch && batteryMatch[1]) {
    batteryPercent = parseInt(batteryMatch[1], 10);
  }

  // Build clean summary
  const parts: string[] = [];
  if (detectedVehicle) parts.push(`Vehicle: ${detectedVehicle.toUpperCase()}`);
  if (arrivalDeadline) parts.push(`Arrival: ${arrivalDeadline}`);
  if (maxBudget) parts.push(`Max Budget: ₹${maxBudget}`);
  if (priority) parts.push(`Priority: ${priority.toUpperCase()}`);
  if (avoidTolls) parts.push(`Tolls: Avoid`);
  if (batteryPercent) parts.push(`Battery: ${batteryPercent}%`);

  return {
    rawQuery: query,
    detectedVehicle,
    arrivalDeadline,
    maxBudget,
    priority,
    avoidTolls,
    avoidWaterlogging,
    batteryPercent,
    summary: parts.join(' | ') || 'Configured AI criteria'
  };
}

export const SAMPLE_AI_QUERIES = [
  "I need to reach college by 9 AM, I'm on a bike and I don't want to spend more than ₹150.",
  "Avoid all tolls and give me the smoothest road for my car.",
  "I have only 24% battery on my EV, find the safest route with charging stations.",
  "I'm in a rush to the airport, I don't mind spending more if it saves time.",
  "Heavy monsoon outside: find me the safest route avoiding waterlogging and rough patches."
];
