'use server';

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function generateCodeFromImage(base64Image: string) {
  try {
    const { text } = await generateText({
      // We use 1.5-flash because it has a higher stable quota for free users
      model: google('gemini-3-flash'), 
      messages: [
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: `You are the ScribbleScript AI Engine. 
              
              Task: Convert the provided hand-drawn UI sketch into a professional, single-file React component.
              
              Technical Requirements:
              1. Use Tailwind CSS for all styling and layout.
              2. Use Lucide-React for any icons represented in the sketch.
              3. Colors: Use a modern, dark-themed palette (Slate, Zinc, and Amber accents).
              4. Code Structure: Export a single default function called App.
              5. Functionality: Add basic React hooks (useState) to make buttons and inputs interactive.
              6. Formatting: Return ONLY the code. Do not include markdown code blocks or explanations.` 
            },
            { 
              type: 'image', 
              image: base64Image.split(',')[1] 
            },
          ],
        },
      ],
    });

    // Final cleanup to ensure no markdown remains
    return text.replace(/```jsx|```tsx|```javascript|```typescript|```/g, '').trim();
    
  } catch (error) {
    console.error("ScribbleScript Backend Error:", error);
    return `export default function Error() { 
      return (
        <div className='p-10 text-center bg-slate-900 h-full flex flex-col items-center justify-center text-slate-100'>
          <h1 className='text-2xl font-bold text-amber-400 mb-2'>Engine Stalled</h1>
          <p className='text-slate-400 underline'>Check your API quota or billing status in Google AI Studio.</p>
        </div>
      ) 
    }`;
  }
}