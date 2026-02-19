import { STATUS_CODE } from "../../../constants/appConstants";
import { CustomError } from "../../../utils";

export const getAllCoursesService = async (req: any) => {
  const tenantPrisma = req.tenantPrisma;
  const courses = await tenantPrisma.lms_course.findMany({
    orderBy: { created_at: "desc" },
  });
  return courses;
};

export const getCourseByIdService = async (req: any, id: number) => {
  const tenantPrisma = req.tenantPrisma;
  const course = await tenantPrisma.lms_course.findUnique({
    where: { id },
    include: {
      lms_module: true,
    },
  });

  if (!course) {
    throw new CustomError({
      message: "Course not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  return course;
};

export const createCourseService = async (req: any, data: any) => {
  const tenantPrisma = req.tenantPrisma;
  const course = await tenantPrisma.lms_course.create({
    data: {
      name: data.name,
      description: data.description,
      is_published: false,
    },
  });
  return course;
};

export const updateCourseService = async (req: any, id: number, data: any) => {
  const tenantPrisma = req.tenantPrisma;

  const existingCourse = await tenantPrisma.lms_course.findUnique({
    where: { id },
  });

  if (!existingCourse) {
    throw new CustomError({
      message: "Course not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  const updatedCourse = await tenantPrisma.lms_course.update({
    where: { id },
    data: {
      name: data.name ?? existingCourse.name,
      description: data.description ?? existingCourse.description,
      is_published: data.is_published ?? existingCourse.is_published,
    },
  });

  return updatedCourse;
};

export const deleteCourseService = async (req: any, id: number) => {
  const tenantPrisma = req.tenantPrisma;

  const existingCourse = await tenantPrisma.lms_course.findUnique({
    where: { id },
  });

  if (!existingCourse) {
    throw new CustomError({
      message: "Course not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  // Note: Logic to handle related modules is not included as they have on Delete NoAction.
  // This will throw if valid foreign keys exist. Explicit deletion of submodules would be needed for cascade.
  await tenantPrisma.lms_course.delete({
    where: { id },
  });

  return true;
};

export const updateVisibilityService = async (req: any, id: number, is_published: boolean) => {
  const tenantPrisma = req.tenantPrisma;

  const existingCourse = await tenantPrisma.lms_course.findUnique({
    where: { id },
  });

  if (!existingCourse) {
    throw new CustomError({
      message: "Course not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  const updatedCourse = await tenantPrisma.lms_course.update({
    where: { id },
    data: {
      is_published,
    },
  });

  return updatedCourse;
};

export const getCourseDropdownService = async (
  req: any,
  courseName: string | undefined
) => {
  const tenantPrisma = req.tenantPrisma;

  const whereCondition: any = {};
  if (courseName) {
    whereCondition.name = {
      contains: courseName,
      mode: "insensitive",
    };
  }

  const courses = await tenantPrisma.lms_course.findMany({
    where: whereCondition,
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return courses;
};
