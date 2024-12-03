import doctorsApi from '../remoteServices/doctorsApi';
import constants from '../helpers/constants';

export const searchDoctorsService = async (combinedParams: any,reply:any) => {
  let { doctorName, doctorname, doctorSpecialty } = combinedParams;
  if (doctorname) {
    doctorName = doctorname?.name;
    reply.params.doctorName = doctorName
  }
  const matchingDoctors = doctorsApi.findDoctorsByNameAndSpecialty(
    doctorName,
    doctorSpecialty
  );
  return matchingDoctors;
};

export const findAvailableSlotsService = async (combinedParams: any, reply:any) => {
  let { doctorName, doctorname, doctorSpecialty, preferredTimeSlot } =
    combinedParams;
  if (doctorname) {
    doctorName = doctorname?.name;
    reply.params.doctorName = doctorName
  }
  const slots = await doctorsApi.findAvailableSlots(
    doctorName,
    doctorSpecialty,
    preferredTimeSlot
  );
  return { slots, nearestSlot: slots[0] };
};

export const collectDoctorAndSlotDetailsService = async (
  combinedParams: any,
  reply: { replyToUser: string[]; targetPage: any; params: any }
) => {
  const { doctorName, doctorSpecialty, patientHealthProblem } = combinedParams;
  reply.targetPage =
    constants.pages.FinaliseDoctorAndSlotFlow.DetailsCollectionIteration;
  if (!doctorName && !doctorSpecialty && !patientHealthProblem) {
    //No param is filled, initial case.
    // reply.payload = await doctorsApi.getAllData();
    return reply.replyToUser.push(
      `Can you provide which doctor you are looking for? or any specific health problem you want consultation`
    );
  }

  if (doctorName) {
    //Doctor name is given
    const matchingDoctors = await doctorsApi.findDoctorsByName(doctorName);
    if (!matchingDoctors || matchingDoctors.length == 0) {
      return reply.replyToUser.push(
        "We couldn't find such doctor name in our system, can you provide more details or any other doctor name."
      );
    }
    if (matchingDoctors.length == 1) {
      const doctor = matchingDoctors[0];
      reply.params.isDoctorFound = true;
      reply.params.suggestedTimeSlot = `${doctor.available_slots[0].date} ${doctor.available_slots[0].slots[0]}`;
      reply.targetPage =
        constants.pages.FinaliseDoctorAndSlotFlow.AnyPreferredTimeSlot;
      return reply.replyToUser.push(
        `We found the doctor ${doctorName}, he is next available at ${reply.params.suggestedTimeSlot}
        Do you want to book on that time or do you have any preferred time slot?`
      );
    }
    if (matchingDoctors.length >= 1) {
      return reply.replyToUser.push(
        `Found multiple doctors case, still working....`
      );
    }
    return reply.replyToUser.push(`Still working...`);
  } else if (doctorSpecialty) {
    const matchingDoctors =
      await doctorsApi.findDoctorsBySpecialty(doctorSpecialty);
    if (!matchingDoctors || matchingDoctors.length == 0) {
      return reply.replyToUser.push(
        `Sorry, We couldn't find any doctor with the specialization in ${doctorSpecialty}, If you can provide your health problem that you want the consultation, we can assist you the right doctor.`
      );
    }
    if (matchingDoctors.length == 1) {
      const doctor = matchingDoctors[0];
      return reply.replyToUser.push(
        `We found the doctor ${doctorName} ${doctorSpecialty}, he is next available at ${doctor.available_slots[0].date} ${doctor.available_slots[0].slots[0]}
            Do you want to book on that time or do you have any preferred time slot?`
      );
    }
    if (matchingDoctors.length > 1) {
      reply.params.isMultipleDoctorsFoundForSpeciality = true;
      return reply.replyToUser.push(
        `We have ${matchingDoctors[0].role} doctors available, Are you looking for any specific doctor name or should I assist you finding right doctor?`
      );
    }
    return reply.replyToUser.push(`Still working...`);
  }
};

export const isUserPreferringAnyTimeSlot = async (
  combinedParams: any,
  reply: { replyToUser: string[]; targetPage: any; params: any }
) => {
  const {
    doctorName,
    doctorSpecialty,
    isUserOkayWithAgentSuggestedSlot,
    preferredTimeSlot,
    suggestedTimeSlot,
  } = combinedParams;

  console.log('isUserPreferringAnyTimeSlot service', {
    doctorName,
    doctorSpecialty,
    isUserOkayWithAgentSuggestedSlot,
    preferredTimeSlot,
    suggestedTimeSlot,
  });
  if (
    doctorName &&
    suggestedTimeSlot &&
    isUserOkayWithAgentSuggestedSlot == 'Yes'
  ) {
    reply.params.isUserOkayWithAgentSuggestedSlot = 'Yes';
    reply.targetPage =
      constants.pages.FinaliseDoctorAndSlotFlow.FinalConfirmationPage;
    return;
  } else if (
    doctorName &&
    suggestedTimeSlot &&
    isUserOkayWithAgentSuggestedSlot == 'No'
  ) {
    return reply.replyToUser.push(`Still working...`);
  }
};
