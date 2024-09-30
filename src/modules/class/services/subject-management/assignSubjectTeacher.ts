import { TAssignSubjectTeacherPayload } from '../../class.validation';
import { prismaClient } from '../../../../app/prisma';
import { AppError } from '../../../../utils';

export const assignSubjectTeacher = async (
  sectionId: string,
  payload: TAssignSubjectTeacherPayload,
) => {
  const { name, teacherId } = payload;
  const isTeacherExist = await prismaClient.subjectTeacher.findUnique({
    where: { sectionId, subject: name },
    include: { teacher: { select: { name: true } } },
  });

  // case - 1 where already a teacher was assigned
  if (isTeacherExist) {
    // when the the teacher is already assigned for the course
    if (isTeacherExist.teacherId === teacherId)
      throw new AppError(
        `${isTeacherExist.teacher.name} is already the course teacher of ${name}`,
        400,
      );

    const result = await prismaClient.subjectTeacher.update({
      where: { sectionId, subject: name },
      data: { teacherId },
    });

    return result;
  }

  // case - 2 no teacher was assigned for the subject
  const result = await prismaClient.subjectTeacher.create({
    data: { sectionId, subject: name, teacherId },
  });

  return result;
};
