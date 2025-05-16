
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { instructions } = await req.json()
    
    if (!instructions) {
      return new Response(
        JSON.stringify({ error: 'Instructions are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // For now, create a mock challenge based on the instructions
    // In the future, this would call an LLM API like OpenAI to generate a real challenge
    const mockChallenge = generateMockChallenge(instructions)
    
    return new Response(
      JSON.stringify(mockChallenge),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-challenge function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Mock function to generate a challenge
// In a real implementation, this would call an AI service
function generateMockChallenge(instructions: string) {
  const topic = instructions.toLowerCase().includes('array') ? 'Array Manipulation' : 
               instructions.toLowerCase().includes('string') ? 'String Processing' :
               instructions.toLowerCase().includes('tree') ? 'Binary Tree' : 
               'Algorithm Challenge'
               
  const difficulty = instructions.toLowerCase().includes('easy') ? 'Easy' :
                   instructions.toLowerCase().includes('hard') ? 'Hard' :
                   'Medium'
  
  return {
    title: `${topic} Challenge`,
    description: `# ${topic} Challenge\n\nThis is an AI-generated challenge based on your instructions: "${instructions}"\n\nWrite an algorithm that solves the given problem efficiently.`,
    difficulty: difficulty,
    solution_template: `function solution(input) {\n  // Write your solution here\n  \n  return result;\n}`,
    tags: topic.toLowerCase().split(' '),
    test_cases: [
      { input: "example1", expected: "result1" },
      { input: "example2", expected: "result2" },
      { input: "example3", expected: "result3" }
    ]
  }
}
