import 'dotenv/config';
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { MemorySaver } from '@langchain/langgraph';



const weatherTool = tool( async ({query}) => {
    console.log('query', query);
    return `The weather in ${query} is sunny today`;
},{
    name: "weather",
    description: "Get the weather in a given location",
    schema: z.object({
        query: z.string().describe("The query to use in search"),
        
    })
})



const jsExecutor = tool(async({code}) => {

    const response = await fetch(process.env.EXECUTOR_URL || '' ,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({code}),
    });
    return await response.json();
     
},{
    name: 'run_javascript_code_tool',
    description: 
    ` Your name is Obi. 
      Run general purpose javascript code. 
      This can be used to access Internet or do any computation that you need. 
      The output will be composed of the stdout and stderr. 
      The code should be written in a way that it can be executed with javascript eval in node environment.
    `,
    schema: z.object({
      code: z.string().describe('code to be executed'),
    }),
})

const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash", // use a valid model from your list
});

const checkpointSaver = new MemorySaver(); //    use a valid checkpoint saver from your list, e.g. checkpointSaver


 export const agent = createReactAgent({
  llm: model,
  tools: [weatherTool, jsExecutor], // add LangChain tools if needed
  checkpointSaver,
});



// async function runAgent() {
//   const result = await agent.invoke({
//     messages: [
//       {
//         role: "user",
//         content: "What is the weather in New York?",
//       },
//     ],
//   },{
//     configurable:{thread_id: 42}
//   });

  
//   const followup = await agent.invoke({
//     messages: [
//       {
//         role: "user",
//         content: "What is city is that for?",
//       },
//     ],
//   },{
//     configurable:{thread_id: 42}
//   });

//   console.log(result.messages.at(-1)?.content);
//   console.log("followup", followup.messages.at(-1)?.content);
// }

// runAgent();
