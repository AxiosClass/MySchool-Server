import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { TObject } from '../../utils/types';
import { termService } from './term.service';

const addTerms = catchAsync(async (req, res) => {
  const message = await termService.addTerm(req.body);
  sendSuccessResponse(res, { message });
});

const getTerms = catchAsync(async (req, res) => {
  const terms = await termService.getTerms(req.query as TObject);
  sendSuccessResponse(res, { message: 'Terms fetched successfully', data: terms });
});

const updateTerm = catchAsync(async (req, res) => {
  const message = await termService.updateTerm(req.body, req.params.termId);
  sendSuccessResponse(res, { message });
});

const updateStatus = catchAsync(async (req, res) => {
  const message = await termService.updateStatus(req.body, req.params.termId);
  sendSuccessResponse(res, { message });
});

const deleteTerm = catchAsync(async (req, res) => {
  const message = await termService.deleteTerm(req.params.termId);
  sendSuccessResponse(res, { message });
});

const getOngoingTerm = catchAsync(async (req, res) => {
  const term = await termService.getOngoingTerm();
  sendSuccessResponse(res, { message: 'Current ongoing term fetched successfully', data: term });
});

export const termController = { addTerms, getTerms, updateTerm, updateStatus, deleteTerm, getOngoingTerm };
