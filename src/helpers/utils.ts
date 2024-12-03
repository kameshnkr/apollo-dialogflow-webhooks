export const parseJsonFromLLM = (llmOutput:String)=>{
    let parsedJson;
  try {
    parsedJson = JSON.parse(
        llmOutput.replace('```json', '').replace('```', '')
    );
    console.log({ parsedJson });
  } catch (e) {
    console.log(e);
  }
  return parsedJson
}