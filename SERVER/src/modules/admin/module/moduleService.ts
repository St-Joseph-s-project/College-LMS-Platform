import { STATUS_CODE } from "../../../constants/appConstants";
import { CustomError } from "../../../utils";

export const getAllModulesService = async (req: any, courseId: number) => {
  const tenantPrisma = req.tenantPrisma;
  
  // Verify if course exists
  const course = await tenantPrisma.lms_course.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    throw new CustomError({
      message: "Course not found",
      statusCode: STATUS_CODE.NOT_FOUND
    });
  }

  const modules = await tenantPrisma.lms_module.findMany({
    where: { course_id: courseId },
    orderBy: { order_index: 'asc' }
  });

  return modules;
};

export const addModuleService = async (req: any, courseId: number, moduleData: any) => {
  const tenantPrisma = req.tenantPrisma;

  // Verify if course exists
  const course = await tenantPrisma.lms_course.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    throw new CustomError({
      message: "Course not found",
      statusCode: STATUS_CODE.NOT_FOUND
    });
  }

  // Calculate order_index if not provided
  let orderIndex = moduleData.orderIndex;
  
  if (orderIndex === undefined || orderIndex === null) {
    const lastModule = await tenantPrisma.lms_module.findFirst({
      where: { course_id: courseId },
      orderBy: { order_index: 'desc' }
    });
    orderIndex = (lastModule?.order_index ?? 0) + 1;
  } else {
    // If orderIndex is provided, check if we need to shift existing modules
    const existingModuleAtOrder = await tenantPrisma.lms_module.findFirst({
      where: {
        course_id: courseId,
        order_index: orderIndex
      }
    });

    if (existingModuleAtOrder) {
      // Shift all modules with order_index >= provided orderIndex
      await tenantPrisma.lms_module.updateMany({
        where: {
          course_id: courseId,
          order_index: {
            gte: orderIndex
          }
        },
        data: {
          order_index: {
            increment: 1
          }
        }
      });
    }
  }

  const newModule = await tenantPrisma.lms_module.create({
    data: {
      course_id: courseId,
      name: moduleData.name,
      description: moduleData.description,
      order_index: orderIndex,
      is_published: false // Default to false
    }
  });

  return newModule;
};

export const updateModuleService = async (req: any, moduleId: number, updateData: any) => {
  const tenantPrisma = req.tenantPrisma;

  // Verify if module exists
  const existingModule = await tenantPrisma.lms_module.findUnique({
    where: { id: moduleId }
  });

  if (!existingModule) {
    throw new CustomError({
      message: "Module not found",
      statusCode: STATUS_CODE.NOT_FOUND
    });
  }

  // Handle reordering if orderIndex is updated
  if (updateData.orderIndex !== undefined && updateData.orderIndex !== null) {
    const oldIndex = existingModule.order_index;
    const newIndex = updateData.orderIndex;

    if (newIndex !== oldIndex) {
      if (newIndex < oldIndex) {
        // Moving up: Increment order_index for modules between newIndex and oldIndex (exclusive of oldIndex)
        await tenantPrisma.lms_module.updateMany({
          where: {
            course_id: existingModule.course_id,
            order_index: {
              gte: newIndex,
              lt: oldIndex
            }
          },
          data: {
            order_index: {
              increment: 1
            }
          }
        });
      } else {
        // Moving down: Decrement order_index for modules between oldIndex and newIndex (inclusive of newIndex)
        await tenantPrisma.lms_module.updateMany({
          where: {
            course_id: existingModule.course_id,
            order_index: {
              gt: oldIndex,
              lte: newIndex
            }
          },
          data: {
            order_index: {
              decrement: 1
            }
          }
        });
      }
    }
  }

  const updatedModule = await tenantPrisma.lms_module.update({
    where: { id: moduleId },
    data: {
      name: updateData.name,
      description: updateData.description,
      order_index: updateData.orderIndex
    }
  });

  return updatedModule;
};

export const updateModuleVisibilityService = async (req: any, moduleId: number, isPublished: boolean) => {
  const tenantPrisma = req.tenantPrisma;

  // Verify if module exists
  const existingModule = await tenantPrisma.lms_module.findUnique({
    where: { id: moduleId }
  });

  if (!existingModule) {
    throw new CustomError({
      message: "Module not found",
      statusCode: STATUS_CODE.NOT_FOUND
    });
  }

  const updatedModule = await tenantPrisma.lms_module.update({
    where: { id: moduleId },
    data: {
      is_published: isPublished
    }
  });

  return updatedModule;
};

export const deleteModuleService = async (req: any, moduleId: number) => {
  const tenantPrisma = req.tenantPrisma;

  // Verify if module exists
  const existingModule = await tenantPrisma.lms_module.findUnique({
    where: { id: moduleId }
  });

  if (!existingModule) {
    throw new CustomError({
      message: "Module not found",
      statusCode: STATUS_CODE.NOT_FOUND
    });
  }

  // Perform cascade delete manually in a transaction
  await tenantPrisma.$transaction(async (prisma: any) => {
    // 1. Find all submodules
    const submodules = await prisma.lms_submodule.findMany({
      where: { module_id: moduleId },
      select: { id: true }
    });
    const submoduleIds = submodules.map((s: any) => s.id);

    if (submoduleIds.length > 0) {
      // 2. Find all questions associated with submodules
      const questions = await prisma.lms_submodule_question.findMany({
        where: { submodule_id: { in: submoduleIds } },
        select: { id: true }
      });
      const questionIds = questions.map((q: any) => q.id);

      if (questionIds.length > 0) {
        // 3. Delete all question options
        await prisma.lms_question_options.deleteMany({
          where: { question_id: { in: questionIds } }
        });

        // 4. Delete all submodule questions
        await prisma.lms_submodule_question.deleteMany({
          where: { id: { in: questionIds } }
        });
      }

      // 5. Delete all submodules
      await prisma.lms_submodule.deleteMany({
        where: { id: { in: submoduleIds } }
      });
    }

    // 6. Delete all user module views
    await prisma.lms_user_module_view.deleteMany({
      where: { module_id: moduleId }
    });

    // 7. Delete the module
    await prisma.lms_module.delete({
      where: { id: moduleId }
    });
  });

  return { message: "Module deleted successfully" };
};
