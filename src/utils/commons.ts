export const parseJsonFromLLM = (llmOutput: String) => {
  let parsedJson;
  try {
    parsedJson = JSON.parse(
      llmOutput.replace('```json', '').replace('```', '')
    );
    console.log({ parsedJson });
  } catch (e) {
    console.log(e);
  }
  return parsedJson;
};
export const getFunctionName = () => {
  const stack = new Error().stack;
  const callerFunctionName = stack?.split('\n')[2]?.trim().split(' ')[1];
  return callerFunctionName || 'UnknownFunction';
};
