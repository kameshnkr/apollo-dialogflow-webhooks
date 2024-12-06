import doctorsProvider from '../providers/consult.provider';

const consultService = {
  searchDoctorsService: async (combinedParams: any, reply: any) => {
    let { doctor_name, doctor_specialty, patient_health_issue } =
      combinedParams;
    // if (doctorname) {
    //   doctorName = doctorname?.name || doctorname;
    //   reply.params.doctorName = doctor_name
    // }
    const matchingDoctors = doctorsProvider.findDoctors(
      doctor_name,
      doctor_specialty,
      patient_health_issue
    );
    return matchingDoctors;
  },

  findAvailableSlotsService: async (combinedParams: any, reply: any) => {
    let { doctor_name, doctor_specialty, preferredTimeSlot } = combinedParams;
    const slots = await doctorsProvider.findAvailableSlots(
      doctor_name,
      doctor_specialty,
      preferredTimeSlot
    );
    return { slots, nearestSlot: slots[0] };
  },
};

export default consultService;
