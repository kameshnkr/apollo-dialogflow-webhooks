const doctorsData = [
  {
    name: 'Dr. Rahul',
    specialty: ['dentistry'],
    role: 'Dentist',
    available_slots: [
      {
        date: '24th Nov 2024',
        slots: ['10AM', '12PM'],
      },
      {
        date: '25th Nov 2024',
        slots: ['10AM', '12PM'],
      },
    ],
  },
  {
    name: 'Dr. Krishna',
    specialty: ['dentistry'],
    role: 'Dentist',
    available_slots: [
      {
        date: '24th Nov 2024',
        slots: ['11AM', '02PM'],
      },
      {
        date: '25th Nov 2024',
        slots: ['10AM', '12PM'],
      },
    ],
  },
  {
    name: 'Dr. Ramesh',
    specialty: ['general practice'],
    role: 'General physician',
    available_slots: [
      {
        date: '24th Nov 2024',
        slots: ['10AM', '12PM'],
      },
      {
        date: '25th Nov 2024',
        slots: ['10AM', '12PM'],
      },
    ],
  },
  {
    name: 'Dr. Vamsi',
    specialty: ['cardiology'],
    role: 'Cardiologist',
    available_slots: [
      {
        date: '24th Nov 2024',
        slots: ['10AM', '12PM'],
      },
      {
        date: '25th Nov 2024',
        slots: ['10AM', '12PM'],
      },
    ],
  },
];

const doctorsApi = {
  getAllData: async () => {
    return doctorsData;
  },
  findAvailableSlots: async (
    doctorName: any,
    specialty: any,
    preferredTimeSlot: any
  ) => {
    try {
      return ['24th Nov 2024 10AM', '24th Nov 2024 11AM', '25th Nov 2024 11AM'];
    } catch (error: any) {
      console.error('Error finding doctors by name:', error.message);
      throw error;
    }
  },
  findDoctorsByNameAndSpecialty: async (doctorName: any, specialty: any) => {
    try {
      const matchingDoctors = doctorsData.filter((doctor) => {
        if (doctorName && specialty) {
          return (
            doctor.name.toLowerCase().includes(doctorName.toLowerCase()) &&
            doctor.specialty.includes(specialty.toLowerCase())
          );
        }
        if (specialty) {
          return doctor.specialty.includes(specialty.toLowerCase());
        }
        if (doctorName) {
          return doctor.name.toLowerCase().includes(doctorName.toLowerCase());
        }
      });

      return matchingDoctors;
    } catch (error: any) {
      console.error('Error finding doctors by name:', error.message);
      throw error;
    }
  },
  findDoctorsByName: async (doctorName: any) => {
    try {
      if (!doctorName || typeof doctorName !== 'string') {
        throw new Error('Invalid doctor name provided.');
      }

      const matchingDoctors = doctorsData.filter((doctor) =>
        doctor.name.toLowerCase().includes(doctorName.toLowerCase())
      );

      return matchingDoctors;
    } catch (error: any) {
      console.error('Error finding doctors by name:', error.message);
      throw error;
    }
  },
  findDoctorsBySpecialty: async (specialty: any) => {
    try {
      if (!specialty || typeof specialty !== 'string') {
        throw new Error('Invalid doctor specialty provided.');
      }

      const matchingDoctors = doctorsData.filter((doctor) =>
        doctor.specialty.includes(specialty.toLowerCase())
      );

      return matchingDoctors;
    } catch (error: any) {
      console.error('Error finding doctors by specialty:', error.message);
      throw error;
    }
  },
};

export default doctorsApi;
