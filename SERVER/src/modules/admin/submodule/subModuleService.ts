import { STATUS_CODE } from "../../../constants/appConstants";
import { CustomError } from "../../../utils";

export const getSubModuleDetailsService = async (
  req: any,
  courseId: number,
  moduleId: number
) => {
  const tenantPrisma = req.tenantPrisma;

  const course = await tenantPrisma.lms_course.findUnique({
    where: { id: courseId },
    select: {
      name: true,
      is_published: true,
    },
  });

  if (!course) {
    throw new CustomError({
      message: "Course not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  const module = await tenantPrisma.lms_module.findUnique({
    where: { id: moduleId },
    select: {
      name: true,
      is_published: true,
    },
  });

  if (!module) {
    throw new CustomError({
      message: "Module not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  return {
    course: course,
    module: module,
  };
};

export const getAllSubModulesService = async (
  req: any,
  courseId: number,
  moduleId: number
) => {
  const tenantPrisma = req.tenantPrisma;

  const subModules = await tenantPrisma.lms_submodule.findMany({
    where: {
      module_id: moduleId,
      lms_module: {
        course_id: courseId,
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      video_url: true,
      content: true,
      created_at: true,
    },
    orderBy: {
      order_index: "asc", 
    },
  });

  const processedSubModules = subModules.map((subModule: any) => {
    return {
      id: subModule.id,
      name: subModule.name,
      description: subModule.description,
      type: subModule.type,
      video_url: subModule.video_url,
      content: subModule.content,
    };
  });

  return processedSubModules;
};

export const getSubModuleByIdService = async (req: any, subModuleId: number) => {
  const tenantPrisma = req.tenantPrisma;

  const subModule = await tenantPrisma.lms_submodule.findUnique({
    where: { id: subModuleId },
  });

  if (!subModule) {
    throw new CustomError({
      message: "Sub-module not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  return subModule;
};

export const createSubModuleService = async (
  req: any,
  moduleId: number,
  data: any
) => {
  const tenantPrisma = req.tenantPrisma;

  const module = await tenantPrisma.lms_module.findUnique({
    where: { id: moduleId },
  });

  if (!module) {
    throw new CustomError({
      message: "Module not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }


  // Calculate order_index
  let orderIndex = data.orderIndex;

  if (orderIndex === undefined || orderIndex === null) {
    const lastSubModule = await tenantPrisma.lms_submodule.findFirst({
      where: { module_id: moduleId },
      orderBy: { order_index: "desc" },
    });
    orderIndex = (lastSubModule?.order_index ?? 0) + 1;
  } else {
     // If orderIndex is provided, check if we need to shift existing submodules
     const existingSubModuleAtOrder = await tenantPrisma.lms_submodule.findFirst({
      where: {
        module_id: moduleId,
        order_index: orderIndex
      }
    });

    if (existingSubModuleAtOrder) {
      // Shift all submodules with order_index >= provided orderIndex
      await tenantPrisma.lms_submodule.updateMany({
        where: {
          module_id: moduleId,
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

  const newSubModule = await tenantPrisma.lms_submodule.create({
    data: {
      module_id: moduleId,
      name: data.title,
      description: data.description,
      type: data.type,
      order_index: orderIndex,
    },
  });

  return newSubModule;
};

export const updateSubModuleService = async (
  req: any,
  subModuleId: number,
  data: any
) => {
  const tenantPrisma = req.tenantPrisma;

  const existingSubModule = await tenantPrisma.lms_submodule.findUnique({
    where: { id: subModuleId },
  });

  if (!existingSubModule) {
    throw new CustomError({
      message: "Sub-module not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  // Handle reordering if orderIndex is updated
  if (data.orderIndex !== undefined && data.orderIndex !== null) {
    const oldIndex = existingSubModule.order_index ?? 0;
    const newIndex = data.orderIndex;

    if (newIndex !== oldIndex) {
      if (newIndex < oldIndex) {
        // Moving up
        await tenantPrisma.lms_submodule.updateMany({
          where: {
            module_id: existingSubModule.module_id,
            order_index: {
              gte: newIndex,
              lt: oldIndex,
            },
          },
          data: {
            order_index: {
              increment: 1,
            },
          },
        });
      } else {
        // Moving down
        await tenantPrisma.lms_submodule.updateMany({
          where: {
            module_id: existingSubModule.module_id,
            order_index: {
              gt: oldIndex,
              lte: newIndex,
            },
          },
          data: {
            order_index: {
              decrement: 1,
            },
          },
        });
      }
    }
  }

  const updatedSubModule = await tenantPrisma.$transaction(async (prisma: any) => {
    if (existingSubModule.type === "TEST" && data.type && data.type !== "TEST") {
       // Find all questions associated with the submodule
       const questions = await prisma.lms_submodule_question.findMany({
         where: { submodule_id: subModuleId },
         select: { id: true }
       });
       const questionIds = questions.map((q: any) => q.id);
 
       if (questionIds.length > 0) {
         // Delete all question options
         await prisma.lms_question_options.deleteMany({
           where: { question_id: { in: questionIds } }
         });
 
         // Delete all submodule questions
         await prisma.lms_submodule_question.deleteMany({
           where: { id: { in: questionIds } }
         });
       }
    }

    return await prisma.lms_submodule.update({
      where: { id: subModuleId },
      data: {
        name: data.title,
        description: data.description,
        type: data.type,
        order_index: data.orderIndex,
      },
    });
  });

  return updatedSubModule;
};

export const deleteSubModuleService = async (req: any, subModuleId: number) => {
  const tenantPrisma = req.tenantPrisma;

  const existingSubModule = await tenantPrisma.lms_submodule.findUnique({
    where: { id: subModuleId },
  });

  if (!existingSubModule) {
    throw new CustomError({
      message: "Sub-module not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  // Shift order_index for subsequent submodules
  await tenantPrisma.lms_submodule.updateMany({
    where: {
      module_id: existingSubModule.module_id,
      order_index: {
        gt: existingSubModule.order_index ?? 0,
      },
    },
    data: {
      order_index: {
        decrement: 1,
      },
    },
  });
  
  // Note: Cascade delete might be needed for related items (questions etc), similar to module deletion.
  // Assuming basic delete for now as per minimal instruction, but will include basic cleanup if relations exist in schema
  // logic from moduleService delete:
  // 1. Delete questions (if any)
  // 2. Delete submodule

  await tenantPrisma.$transaction(async (prisma: any) => {
     // 1. Find all questions associated with submodules
      const questions = await prisma.lms_submodule_question.findMany({
        where: { submodule_id: subModuleId },
        select: { id: true }
      });
      const questionIds = questions.map((q: any) => q.id);

      if (questionIds.length > 0) {
        // 2. Delete all question options
        await prisma.lms_question_options.deleteMany({
          where: { question_id: { in: questionIds } }
        });

        // 3. Delete all submodule questions
        await prisma.lms_submodule_question.deleteMany({
          where: { id: { in: questionIds } }
        });
      }

      await prisma.lms_submodule.delete({
        where: { id: subModuleId },
      });
  });

  return { message: "Sub-module deleted successfully" };
};

export const getSubModuleContentService = async (req: any, id: number) => {
  const tenantPrisma = req.tenantPrisma;

  const subModule = await tenantPrisma.lms_submodule.findUnique({
    where: { id },
  });

  if (!subModule) {
    throw new CustomError({
      message: "Sub-module not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  const type = subModule.type;

  let testContent = undefined;

  if (type === "TEST") {
    const questions = await tenantPrisma.lms_submodule_question.findMany({
      where: { submodule_id: id },
      include: {
        lms_question_options: {
          orderBy: { order_index: "asc" }
        }
      },
      orderBy: { order_index: "asc" }
    });

    testContent = questions.map((q: any) => {
      const answerOption = q.lms_question_options.find((opt: any) => opt.is_answer);
      return {
        questionNo: q.order_index,
        question: q.question,
        options: q.lms_question_options.map((opt: any) => opt.option_text),
        answer: answerOption ? answerOption.option_text : ""
      };
    });
  }

  return {
    id: subModule.id,
    name: subModule.name,
    description: subModule.description,
    type,
    content: subModule.content,
    ...(type === "YT" && { videoUrl: subModule.video_url }),
    ...(type === "TEST" && { testContent })
  };
};

export const updateSubModuleContentService = async (
  req: any,
  id: number,
  data: any
) => {
  const tenantPrisma = req.tenantPrisma;

  const existingSubModule = await tenantPrisma.lms_submodule.findUnique({
    where: { id },
  });

  if (!existingSubModule) {
    throw new CustomError({
      message: "Sub-module not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  if (existingSubModule.type === "TEST") {
    if (data.testContent && Array.isArray(data.testContent)) {
      await tenantPrisma.$transaction(async (prisma: any) => {
        const existingQuestions = await prisma.lms_submodule_question.findMany({ where: { submodule_id: id } });
        const questionIds = existingQuestions.map((q: any) => q.id);
        if (questionIds.length > 0) {
          await prisma.lms_question_options.deleteMany({ where: { question_id: { in: questionIds } } });
          await prisma.lms_submodule_question.deleteMany({ where: { id: { in: questionIds } } });
        }

        for (let i = 0; i < data.testContent.length; i++) {
          const tc = data.testContent[i];
          const question = await prisma.lms_submodule_question.create({
            data: {
              submodule_id: id,
              question: tc.question,
              order_index: tc.questionNo || (i + 1),
            }
          });
          
          const optionsData = tc.options.map((opt: string, index: number) => ({
            question_id: question.id,
            order_index: index + 1,
            option_text: opt,
            is_answer: opt === tc.answer
          }));

          await prisma.lms_question_options.createMany({
            data: optionsData
          });
        }
      });
    }
  } else {
    await tenantPrisma.lms_submodule.update({
      where: { id },
      data: {
        ...(data.content !== undefined && { content: data.content }),
        ...(data.videoUrl !== undefined && { video_url: data.videoUrl })
      }
    });
  }

  return { message: "SubModule content updated successfully" };
};
