import { TAssignSubjectTeacher, TCreateClassroomPayload, TUploadMaterialPayload } from './classroom.validation';
import { AppError } from '../../utils/appError';
import { prismaClient } from '../../app/prisma';
import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';

type MaterialType = 'PDF' | 'IMAGE' | 'VIDEO';

const createClassroom = async (payload: TCreateClassroomPayload) => {
  await prismaClient.classroom.create({ data: { ...payload } });
  return 'Classroom is created successfully';
};

const assignSubjectTeacher = async (payload: TAssignSubjectTeacher) => {
  const isSubjectTeacherAssigned = await prismaClient.classroomSubjectTeacher.findFirst({
    where: { ...payload },
    select: { subject: { select: { name: true } } },
  });

  if (isSubjectTeacherAssigned)
    throw new AppError(`You have already assigned a teacher for ${isSubjectTeacherAssigned.subject.name}`, 400);

  await prismaClient.classroomSubjectTeacher.create({ data: { ...payload } });
  return 'Teacher assigned successfully';
};

const removeSubjectTeacher = async (classroomSubjectTeacherId: string) => {
  await prismaClient.classroomSubjectTeacher.delete({ where: { id: classroomSubjectTeacherId } });
  return 'Teacher removed successfully';
};

const getClassroomListForTeacher = async (teacherId: string) => {
  const selectOptions = { id: true, name: true, class: { select: { name: true } }, students: { select: { id: true } } };

  const classroomsWhereTeacherIsClassTeacher = await prismaClient.classroom.findMany({
    where: { classTeacherId: teacherId },
    select: selectOptions,
  });

  const classroomWhereTeacherIsSubjectTeacher = await prismaClient.classroom.findMany({
    where: { classroomSubjectTeachers: { some: { teacherId: teacherId } } },
    select: selectOptions,
  });
  const onlyClassroomWhereTeacherIsSubjectTeacher = classroomWhereTeacherIsSubjectTeacher.filter(
    (classroom: { id: string }) =>
      !classroomsWhereTeacherIsClassTeacher.some((cls: { id: string }) => cls.id === classroom.id),
  );

  return {
    asClassTeacher: classroomsWhereTeacherIsClassTeacher,
    asSubjectTeacher: onlyClassroomWhereTeacherIsSubjectTeacher,
  };
};

const getStudentList = async (classroomId: string) => {
  const students = await prismaClient.student.findMany({
    where: { classroomId },
    select: { id: true, name: true, class: true },
  });
  return students;
};

const uploadMaterial = async (file: Express.Multer.File, payload: TUploadMaterialPayload) => {
  const classroom = await prismaClient.classroom.findUnique({
    where: { id: payload.classroomId },
  });

  if (!classroom) {
    throw new AppError('Classroom not found', 404);
  }

  const uploadResult = await uploadToCloudinary(file);
  if (!uploadResult) {
    throw new AppError('Failed to upload file', 500);
  }

  let fileType: MaterialType;
  if (file.mimetype.startsWith('image/')) {
    fileType = 'IMAGE';
  } else if (file.mimetype === 'application/pdf') {
    fileType = 'PDF';
  } else if (file.mimetype.startsWith('video/')) {
    fileType = 'VIDEO';
  } else {
    throw new AppError('Unsupported file type', 400);
  }

  const material = await prismaClient.educationalMaterial.create({
    data: {
      ...payload,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileType,
    },
  });

  return material;
};

const getMaterials = async (classroomId: string) => {
  const materials = await prismaClient.educationalMaterial.findMany({
    where: { classroomId },
    orderBy: { uploadedAt: 'desc' },
  });
  return materials;
};

const deleteMaterial = async (materialId: string) => {
  const material = await prismaClient.educationalMaterial.findUnique({
    where: { id: materialId },
  });

  if (!material) {
    throw new AppError('Material not found', 404);
  }

  await deleteFromCloudinary(material.publicId);

  // Delete from database
  await prismaClient.educationalMaterial.delete({
    where: { id: materialId },
  });

  return 'Material deleted successfully';
};

type TSubjectWithTeacher = {
  id: string;
  name: string;
  classroomSubjectTeacherId?: string;
  teacher?: { id: string; name: string };
};

export const classroomService = {
  createClassroom,
  assignSubjectTeacher,
  removeSubjectTeacher,
  getClassroomListForTeacher,
  getStudentList,
  uploadMaterial,
  getMaterials,
  deleteMaterial,
};
