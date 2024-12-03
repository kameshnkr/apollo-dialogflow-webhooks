import { WebhookRequest, WebhookResponse } from '../types';
import { parseJsonFromLLM } from '../helpers/utils';
import constants from '../helpers/constants';
import {
  collectDoctorAndSlotDetailsService,
  isUserPreferringAnyTimeSlot,
  searchDoctorsService,
  findAvailableSlotsService,
} from '../services/fullfillments.service';

const axios = require('axios');

const searchDoctors = async (req: WebhookRequest, res: WebhookResponse) => {
  console.log('searchDoctors Req', JSON.stringify(req.body, null, 2));
  const currentPage = req.body?.pageInfo?.currentPage;
  const sessionParams = req.body?.sessionInfo?.parameters; //Previously existing session params
  if (sessionParams.doctorSpecialty == 'Unknown') {
    delete sessionParams.doctorSpecialty;
  }
  let reply = {
    replyToUser: [],
    targetPage: undefined,
    params: {},
  };

  //Logic
  const doctors = await searchDoctorsService(sessionParams, reply);

  let searchDoctors_suggestionPhrase,
    doctorNextAvailablePhrase,
    searchDoctors_singleMatch,
    searchDoctors_multiMatch,
    targetPage;
  if (!doctors || doctors.length == 0) {
    targetPage = currentPage;
  }
  if (doctors && doctors.length == 1) {
    searchDoctors_singleMatch = true;
    searchDoctors_suggestionPhrase = `We have ${doctors[0].name} available`;
    doctorNextAvailablePhrase = `${doctors[0].name} is next available at ${doctors[0].available_slots[0].slots[0]}`;
  }
  if (doctors && doctors.length >= 1) {
    searchDoctors_multiMatch = true;
    searchDoctors_suggestionPhrase = `We have ${doctors.map((dct) => dct.name).join(', ')} available.`;
  }

  const jsonResponse = {
    sessionInfo: {
      parameters: {
        searchDoctors_singleMatch,
        doctorNextAvailablePhrase,
        searchDoctors_multiMatch,
        searchDoctors_doctorsList: doctors
          ? JSON.stringify(doctors)
          : undefined,
        searchDoctors_suggestionPhrase,
        ...reply.params,
      },
    },
    // targetPage,
  };
  console.log('searchDoctors Resp', JSON.stringify(jsonResponse, null, 2));
  res.send(jsonResponse);
};

const findAvailableSlots = async (
  req: WebhookRequest,
  res: WebhookResponse
) => {
  console.log('searchDoctors Req', JSON.stringify(req.body, null, 2));
  const currentPage = req.body?.pageInfo?.currentPage;
  const sessionParams = req.body?.sessionInfo?.parameters; //Previously existing session params
  if (sessionParams.doctorSpecialty == 'Unknown') {
    delete sessionParams.doctorSpecialty;
  }

  let reply = {
    replyToUser: [],
    targetPage: undefined,
    params: {},
  };

  //Logic
  const slotsInfo = await findAvailableSlotsService(sessionParams, reply);

  let nearestSlot_suggestionPhrase, targetPage;
  if (!slotsInfo) {
    targetPage = currentPage;
  }
  if (slotsInfo.nearestSlot) {
    nearestSlot_suggestionPhrase = `He is available at ${slotsInfo.nearestSlot}`;
  }

  const jsonResponse = {
    sessionInfo: {
      parameters: {
        nearestSlot_suggestionPhrase,
        ...reply.params,
      },
    },

    // targetPage,
  };
  console.log('searchDoctors Resp', JSON.stringify(jsonResponse, null, 2));
  res.send(jsonResponse);
};

const entitiesIdentifiedDoctorDetails = async (
  req: WebhookRequest,
  res: WebhookResponse
) => {
  console.log('entitiesIdentifiedDoctorDetails', req.body);
  const unparsedParams =
    req.body.sessionInfo?.parameters['$request.generative.entities'] || '{}';
  req.body?.sessionInfo?.parameters;
  let parsedParams;
  try {
    parsedParams = JSON.parse(
      unparsedParams.replace('```json', '').replace('```', '')
    );
    console.log({ parsedParams });
  } catch (e) {
    console.log(e);
    res.send({});
  }

  const jsonResponse = {
    sessionInfo: {
      parameters: {
        doctorSpecialty: parsedParams?.['doctor-specialty'],
        doctorName: parsedParams?.['doctor-name'],
      },
    },
  };
  console.log({ jsonResponse });
  res.send(jsonResponse);
};

const collectDoctorAndSlotDetails = async (
  req: WebhookRequest,
  res: WebhookResponse
) => {
  console.log(
    'collectDoctorAndSlotDetails Req',
    JSON.stringify(req.body, null, 2)
  );
  const unparsedParams =
    req.body.sessionInfo?.parameters['$request.generative.entities'] || '{}';
  const parsedParams = parseJsonFromLLM(unparsedParams); //Newly identified params
  const sessionParams = req.body?.sessionInfo?.parameters; //Previously existing session params
  const combinedParams = {
    doctorName: parsedParams?.['doctor-name'] || sessionParams?.['doctorName'],
    doctorSpecialty:
      parsedParams?.['doctor-specialty'] || sessionParams?.['doctorSpecialty'],
    patientHealthProblem:
      parsedParams?.['patient-health-problem'] ||
      sessionParams?.['patientHealthProblem'],
  };

  //Definitions
  let reply = {
    replyToUser: [],
    targetPage: undefined,
    params: {},
  };

  //Logic
  await collectDoctorAndSlotDetailsService(combinedParams, reply);

  const jsonResponse = {
    sessionInfo: {
      parameters: {
        doctorName: parsedParams?.['doctor-name'],
        doctorSpecialty: parsedParams?.['doctor-specialty'],
        patientHealthProblem: parsedParams?.['patient-health-problem'],
        ...reply.params,
      },
    },
    fulfillmentResponse: {
      messages: [
        {
          text: {
            text: reply.replyToUser,
          },
        },
      ],
    },
    targetPage: reply.targetPage,
    // || constants.pages.FinaliseDoctorAndSlotFlow.DetailsCollectionIteration,
  };
  console.log(
    'collectDoctorAndSlotDetails Resp',
    JSON.stringify(jsonResponse, null, 2)
  );
  res.send(jsonResponse);
};

const IsUserPreferringAnyTimeSlot = async (
  req: WebhookRequest,
  res: WebhookResponse
) => {
  console.log(
    'IsUserPreferringAnyTimeSlot Req',
    JSON.stringify(req.body, null, 2)
  );
  const isUserWillingToContinueWithSuggestedSlot =
    req.body.sessionInfo?.parameters['$request.generative.llmOutput'];

  const sessionParams = req.body?.sessionInfo?.parameters; //Previously existing session params
  const combinedParams = {
    isUserWillingToContinueWithSuggestedSlot,
    ...sessionParams,
  };

  //Definitions
  let reply = {
    replyToUser: [],
    targetPage: undefined,
    params: {},
  };

  //Logic
  await isUserPreferringAnyTimeSlot(combinedParams, reply);

  const jsonResponse = {
    sessionInfo: {
      parameters: {
        ...reply.params,
      },
    },
    fulfillmentResponse: {
      messages: [
        {
          text: {
            text: reply.replyToUser,
          },
        },
      ],
    },
    targetPage: reply.targetPage,
  };
  console.log(
    'IsUserPreferringAnyTimeSlot Resp',
    JSON.stringify(jsonResponse, null, 2)
  );
  res.send(jsonResponse);
};

export {
  collectDoctorAndSlotDetails,
  IsUserPreferringAnyTimeSlot,
  searchDoctors,
  entitiesIdentifiedDoctorDetails,
  findAvailableSlots,
};
