import { prismaClient } from '../../app/prisma';
import { TAddStudentPayload } from './student.validation';
import { encryptPassword } from '../../helpers/encryptionHelper';
import { generateRandomCharacter } from '../../helpers/uniqueIdHelper';
import { AppError } from '../../utils/appError';

const date = new Date();
const addStudent = async (payload: TAddStudentPayload) => {
  // getting last student's id
  const classInfo = await prismaClient.classroom.findUnique({
    where: { id: payload.classroomId },
    select: { class: { select: { level: true } } },
  });

  if (!classInfo) throw new AppError('Invalid classroom id', 400);

  const lastStudent = await prismaClient.student.findFirst({
    where: { class: classInfo.class.level },
    orderBy: { admittedAt: 'desc' },
  });

  // generating student's id
  let studentId; // formate of student id => year - class - id_part
  if (!lastStudent) {
    studentId = `${date.getFullYear()}-${classInfo.class.level}-001`;
  } else {
    const [yearPart, classPart, idPart] = lastStudent.id.split('-');
    const idPartAsNumber = Number(idPart) + 1;
    studentId = `${yearPart}-${classPart}-${idPartAsNumber.toString().padStart(3, '0')}`;
  }

  // generating random password
  const password = generateRandomCharacter(4);
  const hashedPassword = await encryptPassword(password);

  // creating the student
  const student = await prismaClient.student.create({
    data: {
      ...payload,
      id: studentId,
      password: hashedPassword,
      class: classInfo.class.level,
    },
    select: { id: true },
  });

  return { id: student.id, password };
};

export const studentService = { addStudent };
