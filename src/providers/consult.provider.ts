const doctorsData = [
  {
    name: 'Dr. Rahul',
    doctor_specialty: ['dentistry'],
    role: 'Dentist',
    health_issues: [
      'toothache',
      'cavities',
      'gum infection',
      'root canal issues',
    ],
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
    name: 'Dr. Sanjay',
    doctor_specialty: ['dentistry'],
    role: 'Dentist',
    health_issues: [
      'toothache',
      'cavities',
      'gum infection',
      'root canal issues',
    ],
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
    doctor_specialty: ['dentistry'],
    role: 'Dentist',
    health_issues: [
      'wisdom tooth pain',
      'teeth cleaning',
      'orthodontic issues',
      'broken tooth',
    ],
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
    doctor_specialty: ['general practice'],
    role: 'General physician',
    health_issues: [
      'fever',
      'cold and cough',
      'body aches',
      'dizziness',
      'headache',
    ],
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
    doctor_specialty: ['cardiology'],
    role: 'Cardiologist',
    health_issues: [
      'chest pain',
      'high blood pressure',
      'shortness of breath',
      'palpitations',
    ],
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
  findAvailableSlots: async (
    doctor_name: any,
    doctor_specialty: any,
    preferred_time_slot: any
  ) => {
    try {
      return ['24th Nov 2024 10AM', '24th Nov 2024 11AM', '25th Nov 2024 11AM'];
    } catch (error: any) {
      console.error('Error finding doctors by name:', error.message);
      throw error;
    }
  },
  findDoctors: async (
    doctor_name: any,
    doctor_specialty: any,
    patient_health_issue: any
  ) => {
    try {
      const matchingDoctors = doctorsData.filter((doctor) => {
        const conditions = [];

        if (doctor_name) {
          conditions.push(
            doctor.name.toLowerCase().includes(doctor_name.toLowerCase())
          );
        }

        if (doctor_specialty) {
          conditions.push(
            doctor.doctor_specialty.some((specialty) =>
              specialty.toLowerCase().includes(doctor_specialty.toLowerCase())
            )
          );
        }

        if (patient_health_issue) {
          conditions.push(
            doctor.health_issues.some((issue) =>
              issue.toLowerCase().includes(patient_health_issue.toLowerCase())
            )
          );
        }

        // Check if all conditions are true
        return conditions.every((condition) => condition);
      });

      return matchingDoctors;
    } catch (error: any) {
      console.error('Error finding doctors by name:', error.message);
      throw error;
    }
  }
};

export default doctorsApi;
