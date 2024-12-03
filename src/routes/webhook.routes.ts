import express from 'express';
import {
  getDoctorDetails,
  getSpecialty,
} from '../controllers/webhook.controller';
import {
  collectDoctorAndSlotDetails,
  IsUserPreferringAnyTimeSlot,
  searchDoctors,
  entitiesIdentifiedDoctorDetails,
  findAvailableSlots
} from '../controllers/fullfillments.controller';

const webHookRouter = express.Router();

webHookRouter.post('/getSpecialty', getSpecialty);

webHookRouter.post('/getDoctorDetails', getDoctorDetails);

webHookRouter.post('/searchDoctors', searchDoctors);

webHookRouter.post('/findAvailableSlots', findAvailableSlots);

webHookRouter.post('/entitiesIdentifiedDoctorDetails', entitiesIdentifiedDoctorDetails);

webHookRouter.post('/collectDoctorAndSlotDetails', collectDoctorAndSlotDetails);

webHookRouter.post('/IsUserPreferringAnyTimeSlot', IsUserPreferringAnyTimeSlot);

export default webHookRouter;
