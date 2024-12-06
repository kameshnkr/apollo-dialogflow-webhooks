import { WebhookRequest, WebhookResponse } from '../types';
import { getFunctionName } from '../utils/commons';
import consultService from '../services/consult.service';

const searchDoctors = async (req: WebhookRequest, res: WebhookResponse) => {
  console.log(`${getFunctionName()} Req`, JSON.stringify(req.body, null, 2));
  const sessionParams = req.body?.sessionInfo?.parameters; //Previously existing session params
  if (sessionParams.doctor_specialty?.toLowerCase() == 'unknown') {
    delete sessionParams.doctor_specialty;
  }
  if (sessionParams.patient_health_issue?.toLowerCase() == 'unknown') {
    delete sessionParams.patient_health_issue;
  }
  let reply = {
    replyToUser: [],
    targetPage: undefined,
    params: {} as any,
  };

  //Logic
  const doctors = await consultService.searchDoctorsService(
    sessionParams,
    reply
  );

  if (!doctors || doctors.length == 0) {
    reply.params.searchDoctors_result_length_type = 'none';
  } else if (doctors && doctors.length == 1) {
    reply.params.searchDoctors_result_length_type = 'single';
    reply.params.doctor_name = doctors[0].name;
    reply.params.doctor_next_available_slot = `${doctors[0].available_slots[0].slots[0]}`;
    reply.params.found_doctors_phrase = `We have ${doctors[0].name} (${doctors[0].role}) available`;
    reply.params.doctor_next_available_phrase = `He is next available at ${doctors[0].available_slots[0].slots[0]}`;
  } else if (doctors && doctors.length > 1) {
    reply.params.searchDoctors_result_length_type = 'multi';
    reply.params.found_doctors_phrase = `We have ${doctors.map((dct) => dct.name).join(', ')} available.`;
  }

  const jsonResponse = {
    sessionInfo: {
      parameters: reply.params,
    },
  };
  console.log(
    `${getFunctionName()} Resp`,
    JSON.stringify(jsonResponse, null, 2)
  );
  res.send(jsonResponse);
};

const findAvailableSlots = async (
  req: WebhookRequest,
  res: WebhookResponse
) => {
  console.log(`${getFunctionName()} Req`, JSON.stringify(req.body, null, 2));
  const currentPage = req.body?.pageInfo?.currentPage;
  const sessionParams = req.body?.sessionInfo?.parameters; //Previously existing session params
  if (sessionParams.doctor_specialty?.toLowerCase() == 'unknown') {
    delete sessionParams.doctor_specialty;
  }

  let reply = {
    replyToUser: [],
    targetPage: undefined,
    params: {} as any,
  };

  //Logic
  const slotsInfo = await consultService.findAvailableSlotsService(
    sessionParams,
    reply
  );

  // if (!slotsInfo) {
  // targetPage = currentPage;
  // }
  if (slotsInfo.nearestSlot) {
    reply.params.doctor_nearest_slot = slotsInfo.nearestSlot;
    reply.params.nearest_slot_suggestion_phrase = `He is available at ${slotsInfo.nearestSlot}`;
  }

  const jsonResponse = {
    sessionInfo: {
      parameters: reply.params,
    },
  };
  console.log(
    `${getFunctionName()} Resp`,
    JSON.stringify(jsonResponse, null, 2)
  );
  res.send(jsonResponse);
};

const setDoctorDetailsParams = async (
  req: WebhookRequest,
  res: WebhookResponse
) => {
  console.log(`${getFunctionName()} Req`, req.body);
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
        doctor_specialty: parsedParams?.['doctor-specialty'],
        doctor_name: parsedParams?.['doctor-name'],
      },
    },
  };
  console.log(
    `${getFunctionName()} Req`,
    JSON.stringify({ jsonResponse }),
    null,
    2
  );
  res.send(jsonResponse);
};

export { searchDoctors, setDoctorDetailsParams, findAvailableSlots };
