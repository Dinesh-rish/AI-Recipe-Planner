
import { MealPlan, ShoppingListItem, UserProfile } from '../types';
// Note: In a real project, you would install jspdf: `npm install jspdf`
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // and `npm install jspdf-autotable`

// Extend jsPDF with autoTable - this is a bit of a hack for module augmentation in this environment
// FIX: Changed interface extension to an intersection type to correctly augment the jsPDF type.
// This ensures that the original jsPDF methods are recognized by the TypeScript compiler.
type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => jsPDF;
};


const downloadFile = (filename: string, content: string, mimeType: string) => {
  const element = document.createElement('a');
  const file = new Blob([content], { type: mimeType });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
};

export const exportToPDF = (mealPlan: MealPlan, shoppingList: ShoppingListItem[], userProfile: UserProfile) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  doc.setFontSize(20);
  doc.text(`Meal Plan for ${userProfile.userId}`, 14, 22);
  doc.setFontSize(12);
  doc.text(`Calorie Goal: ${userProfile.calorieGoal} kcal`, 14, 30);

  mealPlan.forEach((dayPlan) => {
    const tableBody = dayPlan.meals.map(meal => [
      meal.mealType,
      meal.recipe.name,
      meal.recipe.calories.toString(),
      meal.recipe.cookTime,
    ]);
    doc.autoTable({
      head: [[dayPlan.day, 'Recipe', 'Calories', 'Cook Time']],
      body: tableBody,
      startY: (doc as any).lastAutoTable.finalY + 10 || 40,
      theme: 'striped',
    });
  });

  doc.addPage();
  doc.setFontSize(20);
  doc.text('Shopping List', 14, 22);
  
  const shoppingListBody = shoppingList.map(item => [item.name, item.quantity, item.category]);
  doc.autoTable({
    head: [['Item', 'Quantity', 'Category']],
    body: shoppingListBody,
    startY: 30,
    theme: 'grid',
  });

  doc.save('meal_plan.pdf');
};

export const exportToCSV = (shoppingList: ShoppingListItem[]) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Item,Quantity,Category\n";

  shoppingList.forEach(item => {
    csvContent += `${item.name},${item.quantity},${item.category}\n`;
  });

  downloadFile('shopping_list.csv', csvContent, 'text/csv;charset=utf-8;');
};

export const exportToICal = (mealPlan: MealPlan) => {
  const VTIMEZONE = `
BEGIN:VTIMEZONE
TZID:America/New_York
LAST-MODIFIED:20201011T015911Z
TZURL:http://tzurl.org/zoneinfo-outlook/America/New_York
X-LIC-LOCATION:America/New_York
BEGIN:DAYLIGHT
TZNAME:EDT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZNAME:EST
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE`;

  let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AI Meal Planner//EN
CALSCALE:GREGORIAN
${VTIMEZONE}`;
  
  const dayMap: { [key: string]: number } = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6 };

  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))); // Set to this week's Monday

  mealPlan.forEach(dayPlan => {
    dayPlan.meals.forEach(meal => {
      const dayOffset = dayMap[dayPlan.day] || 0;
      const eventDate = new Date(startOfWeek);
      eventDate.setDate(startOfWeek.getDate() + dayOffset);

      let startTime, endTime;
      switch(meal.mealType) {
        case 'Breakfast': startTime = '080000'; endTime = '090000'; break;
        case 'Lunch': startTime = '120000'; endTime = '130000'; break;
        case 'Dinner': startTime = '180000'; endTime = '190000'; break;
        case 'Snack': startTime = '150000'; endTime = '153000'; break;
        default: startTime = '120000'; endTime = '130000';
      }

      const y = eventDate.getFullYear();
      const m = (eventDate.getMonth() + 1).toString().padStart(2, '0');
      const d = eventDate.getDate().toString().padStart(2, '0');
      
      const dtstart = `${y}${m}${d}T${startTime}`;
      const dtend = `${y}${m}${d}T${endTime}`;
      const uid = `${dtstart}-${meal.recipe.name.replace(/\s+/g, '')}@ai-meal-planner.com`;

      icalContent += `
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}
DTSTART;TZID=America/New_York:${dtstart}
DTEND;TZID=America/New_York:${dtend}
SUMMARY:${meal.mealType}: ${meal.recipe.name}
DESCRIPTION:Calories: ${meal.recipe.calories}\\nIngredients: ${meal.recipe.ingredients.join(', ')}\\nInstructions: ${meal.recipe.instructions.join(' ')}
END:VEVENT}`;
    });
  });

  icalContent += "\nEND:VCALENDAR";
  downloadFile('meal_plan.ics', icalContent, 'text/calendar');
};
