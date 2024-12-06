import express from 'express';
import {
  getDoctorDetails,
  getSpecialty,
} from '../controllers/backup.controller';
import {
  searchDoctors,
  setDoctorDetailsParams,
  findAvailableSlots,
} from '../controllers/consult.controller';

const router = express.Router();


router.post('/searchDoctors', searchDoctors);
router.post('/findAvailableSlots', findAvailableSlots);

router.post(
  '/setDoctorDetailsParams',
  setDoctorDetailsParams
);


router.post('/(NA)getSpecialty', getSpecialty);
router.post('/(NA)getDoctorDetails', getDoctorDetails);


export default router;
