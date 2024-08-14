import { NextResponse } from 'next/server'

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

export async function POST(req){
    const data = await req.text();

    const completion = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.LLAMA_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct:free",
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data },
            ],
            top_p: 1,
            temperature: 1,
            repetition_penalty: 1,
            response_format: { type: 'json_object' },
        })
    })
    const result = await completion.json();
    const content = result.choices[0].message.content;

    const jsonMatch = content.match(/{[\s\S]*}/); // Matches the JSON object in the response
    if (!jsonMatch) {
        throw new Error('Failed to extract JSON from the response.');
    }
    const jsonString = jsonMatch[0]; // Extracted JSON string
    const flashcards = JSON.parse(jsonString);
    console.log(flashcards)
    return NextResponse.json(flashcards.flashcards);
}