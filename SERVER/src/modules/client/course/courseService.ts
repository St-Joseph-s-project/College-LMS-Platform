import { STATUS_CODE } from "../../../constants/appConstants";
import { CustomError } from "../../../utils";

export const getCourseModulesService = async (req: any, courseId: number) => {
  const tenantPrisma = req.tenantPrisma;

  const modules = await tenantPrisma.lms_module.findMany({
    where: { 
      course_id: courseId,
      is_published: true
    },
    include: {
      lms_submodule: {
        orderBy: {
          order_index: "asc"
        }
      }
    },
    orderBy: {
      order_index: "asc"
    }
  });

  return modules;
};

export const getModuleDetailsService = async (req: any, moduleId: number) => {
  const tenantPrisma = req.tenantPrisma;

  const module = await tenantPrisma.lms_module.findUnique({
    where: { 
      id: moduleId,
      is_published: true
    },
    include: {
      lms_submodule: {
        include: {
          lms_submodule_question: {
            include: {
              lms_question_options: {
                orderBy: {
                  order_index: "asc"
                }
              }
            },
            orderBy: {
              order_index: "asc"
            }
          }
        },
        orderBy: {
          order_index: "asc"
        }
      }
    }
  });

  return module;
};

export const markSubmoduleCompleteService = async (req: any, submoduleId: number) => {
  const tenantPrisma = req.tenantPrisma;
  const userId = Number(req.user.userId);

  // 1. Get current submodule details
  const currentSubmodule = await tenantPrisma.lms_submodule.findUnique({
    where: { id: submoduleId },
    include: { lms_module: true },
  });

  if (!currentSubmodule) {
    throw new CustomError({
      message: "Submodule not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  const { module_id, order_index } = currentSubmodule;
  const course_id = currentSubmodule.lms_module.course_id;

  // 2. Mark current submodule as COMPLETED
  await tenantPrisma.lms_user_submodule_view.upsert({
    where: {
      user_id_submodule_id: {
        user_id: userId,
        submodule_id: submoduleId,
      },
    },
    update: {
      status: "COMPLETED",
      completed_at: new Date(),
    },
    create: {
      user_id: userId,
      status: "COMPLETED",
      completed_at: new Date(),
      lms_submodule: { connect: { id: submoduleId } },
      lms_module: { connect: { id: module_id } },
      lms_course: { connect: { id: course_id } },
    },
  });

  // 3. Find next submodule in same module
  const nextSubmodule = await tenantPrisma.lms_submodule.findFirst({
    where: {
      module_id,
      order_index: { gt: order_index },
    },
    orderBy: { order_index: "asc" },
  });

  if (nextSubmodule) {
    // Unlock next submodule
    await tenantPrisma.lms_user_submodule_view.upsert({
      where: {
        user_id_submodule_id: {
          user_id: userId,
          submodule_id: nextSubmodule.id,
        },
      },
      update: { status: "IN_PROGRESS" },
      create: {
        user_id: userId,
        status: "IN_PROGRESS",
        started_at: new Date(),
        lms_submodule: { connect: { id: nextSubmodule.id } },
        lms_module: { connect: { id: module_id } },
        lms_course: { connect: { id: course_id } },
      },
    });
    return { next_submodule_id: nextSubmodule.id };
  }

  // 4. No more submodules - Mark current module as COMPLETED
  await tenantPrisma.lms_user_module_view.upsert({
    where: {
      user_id_module_id: {
        user_id: userId,
        module_id: module_id,
      },
    },
    update: {
      status: "COMPLETED",
      completed_at: new Date(),
    },
    create: {
      user_id: userId,
      status: "COMPLETED",
      completed_at: new Date(),
      lms_module: { connect: { id: module_id } },
      lms_course: { connect: { id: course_id } },
    },
  });

  // 5. Find next module in course
  const currentModuleOrder = currentSubmodule.lms_module.order_index;
  const nextModule = await tenantPrisma.lms_module.findFirst({
    where: {
      course_id,
      order_index: { gt: currentModuleOrder },
      is_published: true,
    },
    orderBy: { order_index: "asc" },
  });

  if (nextModule) {
    // Unlock next module
    await tenantPrisma.lms_user_module_view.upsert({
      where: {
        user_id_module_id: {
          user_id: userId,
          module_id: nextModule.id,
        },
      },
      update: { status: "IN_PROGRESS" },
      create: {
        user_id: userId,
        status: "IN_PROGRESS",
        started_at: new Date(),
        lms_module: { connect: { id: nextModule.id } },
        lms_course: { connect: { id: course_id } },
      },
    });

    // Also unlock first submodule of next module
    const firstSubmoduleOfNextModule = await tenantPrisma.lms_submodule.findFirst({
      where: { module_id: nextModule.id },
      orderBy: { order_index: "asc" },
    });

    if (firstSubmoduleOfNextModule) {
      await tenantPrisma.lms_user_submodule_view.upsert({
        where: {
          user_id_submodule_id: {
            user_id: userId,
            submodule_id: firstSubmoduleOfNextModule.id,
          },
        },
        update: { status: "IN_PROGRESS" },
        create: {
          user_id: userId,
          status: "IN_PROGRESS",
          started_at: new Date(),
          lms_submodule: { connect: { id: firstSubmoduleOfNextModule.id } },
          lms_module: { connect: { id: nextModule.id } },
          lms_course: { connect: { id: course_id } },
        },
      });
    }

    return { next_module_id: nextModule.id };
  }

  // All modules in course complete
  return { completed: true };
};
