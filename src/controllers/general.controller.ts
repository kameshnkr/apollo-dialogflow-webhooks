import { WebhookRequest, WebhookResponse } from '../types';


const setIntent = async (req: WebhookRequest, res: WebhookResponse) => {
  console.log('intentSetting', JSON.stringify(req.body, null, 2));
  const identifiedIntent = req.body.sessionInfo?.parameters[
    '$request.generative.intent'
  ]
    ?.replace(/"/g, '')
    ?.trim();
  const jsonResponse = {
    sessionInfo: {
      parameters: {
        '$request.generative.intentDetected': identifiedIntent
      },
    },
  };
  console.log(JSON.stringify({ jsonResponse }, null, 2));
  res.send(jsonResponse);
};


export {
    setIntent
};