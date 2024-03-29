const express = require("express");
const academicCalenderController = require("../controllers/academic-calender-controller");
const { ProtectRoute } = require("../middlewears/auth-middlewear");
const { imageStorageMiddlewear } = require("../middlewears/image-middlewear");

const routes = express.Router();

routes.post(
  "/:adminId",
  ProtectRoute,
  academicCalenderController.addAcademicCalender
);

routes.get(
  "/published-academic-calender",
  academicCalenderController.getAllPublishedAcademicCalender
);

routes.get(
  "/published-academic-calender/:year",
  academicCalenderController.getAllPublishedAcademicCalenderYear
);
routes.get(
  "/unPublished-academic-calender",
  academicCalenderController.getAllUnPublishedAcademicCalender
);
routes.get(
  "/:academicCalenderId",
  academicCalenderController.getSingleAcademicCalender
);
routes.put(
  "/edit-academic-calender/:academicCalenderId/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  academicCalenderController.editSingleAcademicCalender
);
routes.put(
  "/toggle-publish-state/:academicCalenderId/:adminId",
  ProtectRoute,
  academicCalenderController.togglePublishState
);
routes.delete(
  "/delete-academic-calender/:academicCalenderYear/:adminId",
  ProtectRoute,
  academicCalenderController.deleteSingleAcademicCalender
);
routes.delete(
  "/delete-academic-calender-category/:academicCalenderId/:adminId",
  ProtectRoute,
  academicCalenderController.deleteSingleAcademicCalenderCategory
);

module.exports = routes;
