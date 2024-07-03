import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { qualificationRepository } from "../dependencies";

const qualification = new Hono();

qualification.get("/:id", async (c) => {
  const id = c.req.param("id");
  const foundQualification =
    await qualificationRepository.getQualificationById(id);
  if (!foundQualification) {
    throw new HTTPException(404, { message: "Qualification not found" });
  }

  return c.json({
    id: foundQualification.id,
    value: foundQualification.value,
    section: foundQualification.section,
    lapse: foundQualification.lapse,

    student_id: foundQualification.student_id,
    period_id: foundQualification.period_id,
    course_id: foundQualification.course_id,
  });
});

export default qualification;
