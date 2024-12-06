import { WebhookRequest, WebhookResponse } from "../types";

const axios = require('axios');

const getSpecialty = async (req: WebhookRequest, res: WebhookResponse) => {
  console.log(req.body);
  const getData = (query: string) =>
    JSON.stringify({
      query: `query doctorSearch($input: DoctorSearchInput) {
    doctorSearch(input: $input) {
      category
      search_field
      data
      _score
      __typename
    }
  }
  `,
      variables: {
        input: {
          query,
          limit: 1,
          filters: {
            location: {
              lat: "0",
              lon: "0",
            },
          },
        },
      },
    });
  console.log({ API_GATEWAY_URL: process.env.API_GATEWAY_URL })
  const getConfig = (data: string) => ({
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.API_GATEWAY_URL,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${process.env.CONSULT_STATIC_TOKEN}`,
    },
    data: data,
  });

  let data = getData(req.body?.sessionInfo?.parameters?.symptom);
  let config = getConfig(data);

  const resp = await axios.request(config);
  const doctorSearchResults = (await resp?.data?.data?.doctorSearch) || [];
  const suggestedSpecialist = doctorSearchResults?.[0];

  let specialty = suggestedSpecialist?.data?.specialty;
  specialty = Array.isArray(specialty) ? specialty?.[0] : specialty;

  let specialtyId = suggestedSpecialist?.id;
  if (!specialtyId) {
    data = getData(specialty);
    config = getConfig(data);
    const resp1 = await axios.request(config);
    specialtyId =
      (await resp1?.data?.data?.doctorSearch?.[0]?.data?.id) || null;
  }
  const response = {
    sessionInfo: {
      parameters: {
        specialty,
        specialtyId,
      },
    },
  };
  res.status(200).send(response);
};

const getDoctorDetails = async (req: WebhookRequest, res: WebhookResponse) => {
  console.log(req.body);
  try {
    const specialtyId = req.body?.sessionInfo?.parameters?.specialtyId;
    const doctorName = req.body?.sessionInfo?.parameters?.["doctor-name"]?.name;
    console.log({ specialtyId, doctorName });
    const data = JSON.stringify({
      query: `query getDoctorList($filterInput: FilterDoctorInput) {
      getDoctorList(filterInput: $filterInput) {
        doctors
        __typename
      }
    }`,
      variables: {
        filterInput: {
          specialty: specialtyId,
          consultMode: "BOTH",
          experience: [],
          availability: [],
          fees: [],
          gender: [],
          language: [],
          facilityType: [],
          searchText: doctorName,
          facilityId: "",
          geolocation: { latitude: 0, longitude: 0 },
          radius: 100,
        },
      },
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.API_GATEWAY_URL,
      headers: {
        authorization: `Bearer ${process.env.CONSULT_STATIC_TOKEN}`,
        "content-type": "application/json",
      },
      data: data,
    };
    const resp = await axios.request(config);
    const doctors = resp.data?.data?.getDoctorList?.doctors;
    const response = {
      sessionInfo: {
        parameters: {
          doctors,
        },
      },
    };
    res.status(200).send(response);
  } catch (err) {
    console.log({ err: JSON.stringify(err) });
  }
};

export { getDoctorDetails, getSpecialty }